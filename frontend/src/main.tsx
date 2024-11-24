import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPages from "./pages/auth/index.tsx";
import SignInPage from "./pages/auth/signin.tsx";
import SignupPage from "./pages/auth/signup.tsx";

const router = createBrowserRouter([
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
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={router} />
    <App />
  </>
);
