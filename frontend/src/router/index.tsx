import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AuthPages from "../pages/auth";
import SignInPage from "../pages/auth/signin";
import SignupPage from "../pages/auth/signup";
import EmailVerification from "../pages/auth/email-verification";
import AuthGooglePage from "../pages/auth/google";
import HomePage from "../pages/home";
import SignOutPage from "../pages/auth/signout";
import ErrorPage from "../pages/error";

export enum Pages {
  ROOT = "/",
  AUTH = "/auth",
  SIGNIN = "/auth/signin",
  SIGNUP = "/auth/signup",
  GOOGLE_AUTH = "/auth/google",
  EMAIL_VERIFICATION = "/auth/email-verification",
  HOME = "/home",
  SIGNOUT = "/auth/signout",
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: Pages["AUTH"],
        element: <AuthPages />,
        children: [
          {
            path: Pages["SIGNIN"],
            element: <SignInPage />,
          },
          {
            path: Pages["SIGNUP"],
            element: <SignupPage />,
          },
          {
            path: Pages["EMAIL_VERIFICATION"] + "/:id/:token",
            element: <EmailVerification />,
          },
          {
            path: Pages["GOOGLE_AUTH"],
            element: <AuthGooglePage />,
          },
          {
            path: Pages["SIGNOUT"],
            element: <SignOutPage />,
          },
        ],
      },
      {
        path: Pages["HOME"],
        element: <HomePage />,
      },
    ],
  },
]);