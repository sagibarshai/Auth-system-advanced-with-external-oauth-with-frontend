import { useEffect } from "react";
import { Outlet } from "react-router-dom";
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
      MuiFormControl: {
        styleOverrides: {
          root: ({ theme }) => ({
            display: "flex",
            boxShadow: theme.shadows[3],
            justifyContent: "center",
            alignItems: "center",
            width: "50%",
            height: "auto",
            padding: theme.spacing(3),
            borderRadius: theme.shape.borderRadius,
            margin: "auto",
            gap: theme.spacing(2),
          }),
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: ({ theme }) => ({
            display: "block",
            boxShadow: "none",
            justifyContent: "start",
            alignItems: "start",
            width: "auto",
            padding: theme.spacing(0),
            margin: 0,
          }),
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
