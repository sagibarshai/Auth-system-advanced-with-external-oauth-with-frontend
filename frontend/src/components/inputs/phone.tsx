import { InputAdornment, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import { Props as BaseInputProps } from "./types";

export interface Props extends Omit<BaseInputProps, "statics"> {
  staticsProps: {
    countryCode: `+${string}`;
  } & BaseInputProps["staticsProps"];
}

const PhoneInput: React.FC<Props> = ({ stateProps, staticsProps }) => {
  const { errorMsg, label, onChange, required, countryCode } = staticsProps;
  const { isValid, showError, value } = stateProps;

  const theme = useTheme();

  // Calculate the exact height of error message based on theme typography
  const helperTextHeight = `calc(${theme.typography.caption.lineHeight} * ${theme.typography.caption.fontSize})`;

  const shouldShowError = !isValid && showError;

  if (countryCode.length < 2 || countryCode.length > 4)
    throw new Error("Invalid country code: Country code must be between 2 and 4 characters, including the '+' symbol (e.g., '+1', '+44', '+972').");

  return (
    <Tooltip title={shouldShowError ? errorMsg : ""} arrow>
      <TextField
        required={required}
        value={value}
        fullWidth
        label={label}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start">{countryCode}</InputAdornment>,
        }}
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
      />
    </Tooltip>
  );
};

export default PhoneInput;
