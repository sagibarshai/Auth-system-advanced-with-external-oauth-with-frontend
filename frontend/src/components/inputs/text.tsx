import { TextField, Tooltip, Typography, useTheme } from "@mui/material";
import { Props as BaseInputProps } from "./types";

export interface Props extends BaseInputProps {}

const TextInput: React.FC<Props> = ({ stateProps, staticsProps }) => {
  const { errorMsg, label, onChange, required, type } = staticsProps;
  const { isValid, showError, value } = stateProps;

  const theme = useTheme();

  // Calculate the exact height of error message based on theme typography
  const helperTextHeight = `calc(${theme.typography.caption.lineHeight} * ${theme.typography.caption.fontSize})`;

  const shouldShowError = !isValid && showError;

  return (
    <Tooltip title={shouldShowError ? errorMsg : ""} arrow>
      <TextField
        type={type}
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
      />
    </Tooltip>
  );
};

export default TextInput;
