import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Container, Grid } from "@mui/material";
import { useAppRouter } from "./hooks/router";
import { useRequest } from "./hooks/use-request";
import { backendAxiosInstance } from "./api/backend/auth/backend-axios-instance";
import { AuthEndPoints } from "./api/backend/auth/endpoints";
import Header from "./components/header";
import { setUser } from "./redux/features/user";
import { ApiResponseJson, SafeUser } from "./api/backend/auth/types";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { Pages } from "./router";

const App = () => {
  const { appNavigate, getPathName } = useAppRouter();
  const dispatch = useAppDispatch();
  const { data, error, fetchData } = useRequest<ApiResponseJson<SafeUser>>({
    axiosInstance: backendAxiosInstance,
    config: {
      url: AuthEndPoints["CURRENT_USER"],
      method: "get",
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
    if (error && pathName !== Pages.GOOGLE_AUTH) appNavigate("SIGNIN");
    else if (data && pathName === "/") appNavigate("HOME");
  }, [error, data?.data]);

  return (
    <Container sx={{ height: "100vh", width: "100vw", display: "block" }}>
      <Header />

      <Outlet />
    </Container>
  );
};

export default App;
