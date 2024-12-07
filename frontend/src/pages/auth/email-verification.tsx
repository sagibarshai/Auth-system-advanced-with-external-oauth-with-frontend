import React, { useEffect } from "react";
import { backendAxiosInstance } from "../../api/backend/auth/backend-axios-instance";
import { useRequest } from "../../hooks/use-request";
import { AuthEndPoints } from "../../api/backend/auth/endpoints";
import { ApiResponseJson, CustomErrorMessage } from "../../api/backend/auth/types";
import { useAppRouter } from "../../hooks/router";

const EmailVerification: React.FC = () => {
  const { appNavigate, getRouteParams } = useAppRouter();

  const id = getRouteParams<string>("id");
  const token = getRouteParams<string>("token");

  const { data, error, fetchData } = useRequest<ApiResponseJson, CustomErrorMessage>({
    axiosInstance: backendAxiosInstance,
    config: {
      //@ts-ignore
      url: `${AuthEndPoints.EMAIL_VERIFICATION}/${id}/${token}`,
      method: "get",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data?.message) {
      appNavigate(`SIGNIN`, { state: { success: [data.message] } });
    } else if (error) appNavigate("SIGNIN", { state: { errors: error.customErrors } });
  }, [data, error]);

  return null;
};

export default EmailVerification;
