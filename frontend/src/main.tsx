import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { theme } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

createRoot(document.getElementById("root")!).render(
  <>
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  </>
);
