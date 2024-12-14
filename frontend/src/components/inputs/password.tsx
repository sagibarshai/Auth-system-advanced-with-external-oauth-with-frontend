import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { Props as BaseInputProps } from "../inputs/types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import InputErrorMessage from "./input-error-message";

export interface Props extends BaseInputProps {}

const PasswordInput: React.FC<Props> = ({ stateProps, staticsProps }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { errorMsg, label, onChange, required } = staticsProps;
  const { isValid, showError, value } = stateProps;

  const shouldShowError = !isValid && showError;

  const handleShowPasswordToggle = () => setShowPassword((prev) => !prev);

  return (
    <Tooltip title={shouldShowError ? errorMsg : ""} arrow>
      <TextField
        type={showPassword ? "text" : "password"}
        required={required}
        helperText={<InputErrorMessage errorMsg={shouldShowError ? errorMsg : ""} />}
        error={shouldShowError}
        value={value}
        fullWidth
        label={label}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleShowPasswordToggle} edge="end">
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Tooltip>
  );
};

export default PasswordInput;
