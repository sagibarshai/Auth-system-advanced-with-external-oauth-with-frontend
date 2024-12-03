import { Button, ButtonOwnProps } from "@mui/material";
import React from "react";
import Spinner from "../spinners";

interface Props {
  onClick: () => void;
  text: React.ReactNode;
  disabled?: boolean;
  variant?: ButtonOwnProps["variant"];
  loading?: boolean;
}

const AppButton: React.FC<Props> = ({ onClick, text, variant = "contained", disabled = false, loading = false }) => {
  return (
    <Button fullWidth variant={variant} color="primary" type="submit" sx={{ marginTop: 2 }} onClick={onClick} disabled={disabled || loading}>
      {loading ? <Spinner loading={loading} /> : text}
    </Button>
  );
};
export default AppButton;
