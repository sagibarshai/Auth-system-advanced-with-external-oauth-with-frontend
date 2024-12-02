import React, { useEffect } from "react";
import { config } from "../../config";
import useQueryParams from "../../hooks/use-query-params";
import { CustomErrorMessage } from "../../api/backend/auth/types";
import { useNavigate } from "react-router-dom";

const AuthGooglePage: React.FC = () => {
  const { getParam } = useQueryParams();
  const navigate = useNavigate();

  const openGoogleModal = () => (window.location.href = `${config.BACKEND.BASE_URL}/auth/google`);
  useEffect(() => {
    const errors = getParam<CustomErrorMessage>("errors");
    if (errors) navigate("/auth/signin", { state: { errors } });
    else openGoogleModal();
  }, []);
  return null;
};

export default AuthGooglePage;
