import { Box } from "@mui/material";
import AppButton from ".";
import { AppIconGoogle } from "../../icons";
import { useAppRouter } from "../../hooks/router";

const GoogleButton: React.FC = () => {
  const { appNavigate } = useAppRouter();

  const handleGoogleNavigation = () => {
    appNavigate("GOOGLE_AUTH");
  };
  return (
    <AppButton
      variant="outlined"
      onClick={handleGoogleNavigation}
      text={
        <Box sx={{ display: "flex", gap: "8px", alignItems: "center", textTransform: "none" }}>
          <AppIconGoogle size={25} /> Continue with Google
        </Box>
      }
    />
  );
};

export default GoogleButton;
