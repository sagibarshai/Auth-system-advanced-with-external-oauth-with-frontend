import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Props as BaseInputProps } from "../inputs/types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

export interface Props extends BaseInputProps {}

export const PasswordInput: React.FC<Props> = ({ stateProps, staticsProps }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { errorMsg, label, onChange } = staticsProps;
  const { isValid, showError, value } = stateProps;

  const handleShowPasswordToggle = () => setShowPassword((prev) => !prev);

  return (
    <TextField
      helperText={!isValid && showError ? errorMsg : ""}
      error={!isValid && showError}
      value={value}
      fullWidth
      label={label}
      onChange={(e) => onChange(e.target.value)}
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleShowPasswordToggle} edge="end">
              {!showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
