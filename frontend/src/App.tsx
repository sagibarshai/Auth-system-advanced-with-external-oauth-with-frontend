import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box, Stack } from "@mui/material";

import { useAppRouter } from "./hooks/router";
import { useRequest } from "./hooks/use-request";
import { useAppDispatch } from "./hooks/redux";

import Header from "./components/header";

import { setUser } from "./redux/features/user";

import { Pages } from "./router";
import { backendAxiosInstance } from "./api/backend/auth/backend-axios-instance";
import { AuthEndPoints } from "./api/backend/auth/endpoints";

import { ApiResponseJson, SafeUser } from "./api/backend/auth/types";

const App: React.FC = () => {
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

  // navigate based on response to the correct client page
  useEffect(() => {
    const pathName = getPathName();
    if (data?.data) dispatch(setUser(data.data));

    // Always navigate to the signin page unless it's after Google OAuth or email verification, as those routes require URL parameters and they have their own navigation to signin with page state.
    if (error && pathName !== Pages.GOOGLE_AUTH && !pathName.startsWith(Pages.EMAIL_VERIFICATION)) appNavigate("SIGNIN");
    if (error && pathName !== Pages.GOOGLE_AUTH && !pathName.startsWith(Pages.EMAIL_VERIFICATION)) appNavigate("SIGNIN");
    else if (data && pathName === "/") appNavigate("HOME");
  }, [error, data?.data]);

  return (
    <Stack sx={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Header />
      <Box sx={{ height: "100%", width: "100%" }}>
        <Outlet />
      </Box>
    </Stack>
  );
};

export default App;
