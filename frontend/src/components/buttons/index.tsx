import { Button, ButtonOwnProps } from "@mui/material";
import React from "react";

interface Props {
  onClick: () => void;
  text: React.ReactNode;
  disabled?: boolean;
  variant?: ButtonOwnProps["variant"];
}

const AppButton: React.FC<Props> = ({ onClick, text, variant = "contained", disabled = false }) => {
  return (
    <Button fullWidth variant={variant} color="primary" type="submit" sx={{ marginTop: 2 }} onClick={onClick} disabled={disabled}>
      {text}
    </Button>
  );
};
export default AppButton;
