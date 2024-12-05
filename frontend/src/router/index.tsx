import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AuthPages from "../pages/auth";
import SignInPage from "../pages/auth/signin";
import SignupPage from "../pages/auth/signup";
import EmailVerification from "../pages/auth/email-verification";
import AuthGooglePage from "../pages/auth/google";
import HomePage from "../pages/home";

export enum Pages {
  SIGNIN = "/auth/signin",
  SIGNUP = "/auth/signup",
  GOOGLE_AUTH = "/auth/google",
  EMAIL_VERIFICATION = "/auth/email-verification",
  HOME = "/home",
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/auth",
        element: <AuthPages />,
        children: [
          {
            path: "/auth/signin",
            element: <SignInPage />,
          },
          {
            path: "/auth/signup",
            element: <SignupPage />,
          },
          {
            path: "/auth/email-verification/:id/:token",
            element: <EmailVerification />,
          },
          {
            path: "/auth/google",
            element: <AuthGooglePage />,
          },
        ],
      },
      {
        path: "/home",
        element: <HomePage />,
      },
    ],
  },
]);
