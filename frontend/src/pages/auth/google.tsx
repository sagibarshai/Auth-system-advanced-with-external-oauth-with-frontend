import React, { useEffect } from "react";
import { config } from "../../config";

const AuthGooglePage: React.FC = () => {
  const openGoogleModal = () => (window.location.href = `${config.BACKEND.BASE_URL}/auth/google`);
  useEffect(() => {
    openGoogleModal();
  }, []);
  return null;
};

export default AuthGooglePage;
