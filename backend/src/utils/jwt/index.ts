import { Request } from "express";
import { SafeUser } from "../../features/auth/models/auth";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { UnauthorizedError } from "../../errors";
import { config } from "../../config";

const setTokenCookie = (token: string, req: Request) => {
  req.session = {
    token,
  };
};

const createToken = (payload: SafeUser) => {
  return jwt.sign(payload, process.env.JWT_KEY!, { expiresIn: config.JWT.EXPIRED_IN });
};

export const createTokenSetCookie = (payload: SafeUser, req: Request): string => {
  const token = createToken(payload);
  setTokenCookie(token, req);
  return token;
};

export const verifyToken = (token: string): SafeUser | undefined => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY!) as SafeUser;
    return decoded;
  } catch (err) {
    // token is expired or not valid
    throw UnauthorizedError();
  }
};

export const deleteTokenCookie = (req: Request) => {
  req.session = null; // destroy session
};

export const refreshTokenAndSetCookie = (token: string, req: Request): string => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload;

    // get only the clean payload (SafeUser)
    const { exp, iat, ...payload } = decoded;
    const newToken = createToken(payload as SafeUser);

    deleteTokenCookie(req);
    setTokenCookie(newToken, req);

    return newToken;
  } catch (err) {
    // Token is invalid or already expired (shouldn't refresh here)
    throw UnauthorizedError();
  }
};
