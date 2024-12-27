import React, { useEffect } from "react";
import { backendAxiosInstance } from "../../api/backend/auth/backend-axios-instance";
import { useRequest } from "../../hooks/use-request";
import { AuthEndPoints } from "../../api/backend/auth/endpoints";
import { CustomErrorMessage, EmailVerificationResponse } from "../../api/backend/auth/types";
import { useAppRouter } from "../../hooks/router";

const EmailVerification: React.FC = () => {
  const { appNavigate, getRouteParams } = useAppRouter();

  const id = getRouteParams<string>("id");
  const token = getRouteParams<string>("token");

  const { data, error, fetchData } = useRequest<EmailVerificationResponse, CustomErrorMessage>({
    axiosInstance: backendAxiosInstance,
    config: {
      url: `${AuthEndPoints.EMAIL_VERIFICATION}/${id}/${token}`,
      method: "get",
    },
  });

  // fetch the email verification end point
  useEffect(() => {
    fetchData();
  }, []);

  // navigate and send the right data as a page state
  useEffect(() => {
    if (data?.message) {
      appNavigate(`SIGNIN`, { state: { success: [data?.message], data: { email: data?.data?.email } } });
    } else if (error) appNavigate("SIGNIN", { state: { errors: error.customErrors } });
  }, [data, error]);

  return null;
};

export default EmailVerification;
