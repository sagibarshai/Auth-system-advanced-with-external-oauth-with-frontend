import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPages from "./pages/auth/index.tsx";
import SignInPage from "./pages/auth/signin.tsx";
import SignupPage from "./pages/auth/signup.tsx";
import HomePage from "./pages/home/index.tsx";
import EmailVerification from "./pages/auth/email-verification.tsx";
import AuthGooglePage from "./pages/auth/google.tsx";

const router = createBrowserRouter([
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

createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={router} />
  </>
);
