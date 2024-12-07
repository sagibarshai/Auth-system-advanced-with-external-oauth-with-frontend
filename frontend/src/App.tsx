import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { createTheme, CssBaseline, Container, ThemeProvider } from "@mui/material";
import { useAppRouter } from "./hooks/router";
import { useRequest } from "./hooks/use-request";
import { backendAxiosInstance } from "./api/backend/auth/backend-axios-instance";
import { AuthEndPoints } from "./api/backend/auth/endpoints";

const App = () => {
  const { appNavigate, getPathName } = useAppRouter();

  const { data, error, fetchData } = useRequest({
    axiosInstance: backendAxiosInstance,
    config: {
      url: AuthEndPoints["CURRENT_USER"],
      method: "get",
    },
  });

  const theme = createTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "#root": {
            height: "100vh",
            width: "100vw",
          },
          "*": {
            margin: 0,
            padding: 0,
          },
        },
      },
    },
  });

  // fetch user data
  useEffect(() => {
    fetchData();
  }, []);

  // navigate on mount to the proper route
  useEffect(() => {
    const pathName = getPathName();
    if (error && pathName === "/") appNavigate("SIGNIN");
    else if (data && pathName === "/") appNavigate("HOME");
  }, [error, data]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ width: "100vw", height: "100vh" }} disableGutters>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
};

export default App;
