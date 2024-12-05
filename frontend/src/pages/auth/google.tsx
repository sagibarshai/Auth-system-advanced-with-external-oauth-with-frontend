import React, { useEffect } from "react";
import { config } from "../../config";
import { CustomErrorMessage } from "../../api/backend/auth/types";
import { useAppRouter } from "../../hooks/router";

const AuthGooglePage: React.FC = () => {
  const { appNavigate, getParam } = useAppRouter();
  const openGoogleModal = () => (window.location.href = `${config.BACKEND.BASE_URL}/auth/google`);
  useEffect(() => {
    const errors = getParam<CustomErrorMessage>("errors");
    if (errors) appNavigate("SIGNIN", { state: { errors } });
    else openGoogleModal();
  }, []);
  return null;
};

export default AuthGooglePage;
