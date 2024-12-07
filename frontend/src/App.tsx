import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { createTheme, CssBaseline, Container, ThemeProvider } from "@mui/material";
import { useAppRouter } from "./hooks/router";
import { useRequest } from "./hooks/use-request";
import { backendAxiosInstance } from "./api/backend/auth/backend-axios-instance";
import { AuthEndPoints } from "./api/backend/auth/endpoints";
import Header from "./components/header";
import { setUser } from "./redux/features/user";
import { ApiResponseJson, SafeUser } from "./api/backend/auth/types";
import { useAppDispatch, useAppSelector } from "./hooks/redux";

const App = () => {
  const { appNavigate, getPathName } = useAppRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const { data, error, fetchData } = useRequest<ApiResponseJson<SafeUser>>({
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
    if (data?.data) dispatch(setUser(data.data));
    if (error && pathName === "/") appNavigate("SIGNIN");
    else if (data && pathName === "/") appNavigate("HOME");
  }, [error, data?.data]);

  console.log("user ", user);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container sx={{ width: "100vw", height: "100vh" }} disableGutters>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
};

export default App;
