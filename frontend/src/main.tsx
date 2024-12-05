import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPages from "./pages/auth/index.tsx";
import SignInPage from "./pages/auth/signin.tsx";
import SignupPage from "./pages/auth/signup.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </>
);
