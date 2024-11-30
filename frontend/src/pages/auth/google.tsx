import React from "react";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { config } from "../../config";

const GoogleOAuthButton: React.FC = () => {
  const openGoogleModal = () => (window.location.href = `${config.BACKEND.BASE_URL}/auth/google`);
  return (
    <Button sx={{ width: "100%", textDecoration: "underline" }} variant="text" startIcon={<GoogleIcon />} onClick={openGoogleModal}>
      Continue With Google
    </Button>
  );
};

export default GoogleOAuthButton;
