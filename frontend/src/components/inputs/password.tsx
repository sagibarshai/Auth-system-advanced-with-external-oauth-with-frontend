import { IconButton, InputAdornment, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import { Props as BaseInputProps } from "../inputs/types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

export interface Props extends BaseInputProps {}

const PasswordInput: React.FC<Props> = ({ stateProps, staticsProps }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { errorMsg, label, onChange, required } = staticsProps;
  const { isValid, showError, value } = stateProps;

  const theme = useTheme();

  // Calculate the exact height of error message based on theme typography
  const helperTextHeight = `calc(${theme.typography.caption.lineHeight} * ${theme.typography.caption.fontSize})`;

  const shouldShowError = !isValid && showError;

  const handleShowPasswordToggle = () => setShowPassword((prev) => !prev);

  return (
    <Tooltip title={shouldShowError ? errorMsg : ""} arrow>
      <TextField
        type={showPassword ? "text" : "password"}
        required={required}
        helperText={
          <Typography
            variant="caption"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
              minHeight: helperTextHeight, // Use the calculated height
            }}
          >
            {shouldShowError ? errorMsg : ""}
          </Typography>
        }
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
