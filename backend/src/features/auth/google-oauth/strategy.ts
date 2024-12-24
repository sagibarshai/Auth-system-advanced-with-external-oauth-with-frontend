import { Request } from "express";
import passport, { Profile } from "passport";
import { Strategy, StrategyOptionsWithRequest, VerifyCallback } from "passport-google-oauth2";
import { config } from "../../../config";
import { BadRequestError } from "../../../errors";
import { createTokenSetCookie, deleteTokenCookie } from "../../../utils/jwt";
import { InsertExternalUserModel, NewUserPayload, SelectUserModel, UpdateLoginModel } from "../models/auth";

const GOOGLE_OAUTH_CONFIG: StrategyOptionsWithRequest = {
  clientID: config.GOOGLE_OAUTH.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_OAUTH.GOOGLE_CLIENT_SECRET,
  callbackURL: config.GOOGLE_OAUTH.GOOGLE_CALLBACK_URL,
  passReqToCallback: true,
};

export const googleStrategy = passport.use(
  new Strategy(GOOGLE_OAUTH_CONFIG, async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    deleteTokenCookie(req);

    const email = profile.emails?.find((e) => e.type === "account")?.value;

    if (!email) {
      // system not support sign up or sign in operations for users without email
      return done(
        BadRequestError([
          {
            message: `We could not retrieve your email address from the provided information. Please ensure you have granted the necessary permissions or use an account with a valid email.`,
            field: "email",
          },
        ])
      );
    }

    try {
      const newUserPayload: NewUserPayload = {
        email,
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName,
        provider: "google",
      };

      const existingUser = await SelectUserModel(newUserPayload.email);

      if (existingUser) {
        if (!existingUser.isVerified) {
          const errorMessage = `User with email ${newUserPayload.email} already exists and cannot register with Google. Please sign in with email and password.`;
          return done(BadRequestError([{ message: errorMessage, field: "email" }]));
        }

        // let user login even if he is register with email and password
        if (existingUser.provider === "google" || existingUser.provider === "app") {
          // User exists and the provider is google, sign in and set token cookie
          const safeUser = await UpdateLoginModel(existingUser.email!);
          createTokenSetCookie(safeUser, req);
          return done(null, safeUser);
        }
      } else {
        // user not exists, sign up and set token cookie
        const safeUser = await InsertExternalUserModel(newUserPayload);
        createTokenSetCookie(safeUser, req);
        return done(null, safeUser);
      }
    } catch (err) {
      return done(err);
    }
  })
);
