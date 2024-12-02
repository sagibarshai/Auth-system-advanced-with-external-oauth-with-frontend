import React, { useEffect } from "react";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";
import { backendAxiosInstance } from "../../api/backend/auth/backend-axios-instance";
import { useRequest } from "../../hooks/use-request";
import useQueryParams from "../../hooks/use-query-params";
import { AuthEndPoints } from "../../api/backend/auth/endpoints";
import useRouteParams from "../../hooks/use-route-params";
import { CustomErrorMessage } from "../../api/backend/auth/types";

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();

  const { getRouteParams } = useRouteParams();

  const id = getRouteParams("id");
  const token = getRouteParams("token");

  if (!id || !token) {
    // navigate("/auth/signin");
  }

  const { data, error, fetchData, loading } = useRequest<string, CustomErrorMessage>({
    axiosInstance: backendAxiosInstance,
    config: {
      url: `${AuthEndPoints.EMAIL_VERIFICATION}/${id}/${token}`,
      method: "get",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      navigate(`/auth/signin`, { state: { data } });
    }
  }, [data]);

  return <div>{loading ? "Verifying Email....." : data ? JSON.stringify(data) : error ? JSON.stringify(error) : "Nothing"}</div>;
};

export default EmailVerification;
