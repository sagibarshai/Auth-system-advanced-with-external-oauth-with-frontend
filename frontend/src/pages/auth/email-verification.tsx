import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { backendAxiosInstance } from "../../api/backend/auth/backend-axios-instance";
import { useRequest } from "../../hooks/use-request";
import { AuthEndPoints } from "../../api/backend/auth/endpoints";
import useRouteParams from "../../hooks/use-route-params";
import { ApiResponseJson, CustomErrorMessage } from "../../api/backend/auth/types";

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();

  const { getRouteParams } = useRouteParams();

  const id = getRouteParams("id");
  const token = getRouteParams("token");

  if (!id || !token) {
    // navigate("/auth/signin");
  }

  const { data, error, fetchData, loading } = useRequest<ApiResponseJson, CustomErrorMessage>({
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
      navigate(`/auth/signin`, { state: { info: [data.message] } });
    } else if (error) navigate("/auth/signin", { state: { errors: error } });
  }, [data, error]);

  return <div>{loading ? "Verifying Email....." : data ? JSON.stringify(data) : error ? JSON.stringify(error) : "Nothing"}</div>;
};

export default EmailVerification;
