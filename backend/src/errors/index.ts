export enum ErrorTypes {
  BAD_REQUEST_ERROR = "BAD_REQUEST_ERROR",
  NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
  UNAUTHORIZED_ERROR = "UNAUTHORIZED_ERROR",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  FORBIDDEN_ERROR = "FORBIDDEN_ERROR",
}
export type CustomErrorMessage = {
  message: string;
  field?: string;
}[];

export interface ErrorPayload {
  statusCode: number;
  type: ErrorTypes;
  errors: CustomErrorMessage;
}

export const BadRequestError = (payload: CustomErrorMessage): ErrorPayload => {
  return {
    errors: payload || [{ message: "Bad Request Error" }],
    statusCode: 400,
    type: ErrorTypes.BAD_REQUEST_ERROR,
  };
};

export const NotFoundError = (payload?: CustomErrorMessage): ErrorPayload => {
  return {
    errors: payload || [{ message: "Route not found" }],
    statusCode: 404,
    type: ErrorTypes.NOT_FOUND_ERROR,
  };
};

export const InternalServerError = (payload?: CustomErrorMessage): ErrorPayload => {
  return {
    errors: payload || [{ message: "Internal Server Error" }],
    statusCode: 500,
    type: ErrorTypes.INTERNAL_SERVER_ERROR,
  };
};
export const UnauthorizedError = (payload?: CustomErrorMessage): ErrorPayload => {
  return {
    errors: payload || [{ message: "Unauthorized" }],
    statusCode: 401,
    type: ErrorTypes.UNAUTHORIZED_ERROR,
  };
};
export const ForbiddenError = (payload?: CustomErrorMessage): ErrorPayload => {
  return {
    errors: payload || [{ message: "Forbidden" }],
    statusCode: 403,
    type: ErrorTypes.FORBIDDEN_ERROR,
  };
};
