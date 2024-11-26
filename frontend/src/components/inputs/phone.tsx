import { InputAdornment, TextField } from "@mui/material";
import { Props as BaseInputProps } from "./types";

export interface Props extends Omit<BaseInputProps, "statics"> {
  staticsProps: {
    countryCode: `+${string}`;
  } & BaseInputProps["staticsProps"];
}

const PhoneInput: React.FC<Props> = ({ stateProps, staticsProps }) => {
  const { errorMsg, label, onChange, required, countryCode } = staticsProps;
  const { isValid, showError, value } = stateProps;

  if (countryCode.length < 2 || countryCode.length > 4)
    throw new Error("Invalid country code: Country code must be between 2 and 4 characters, including the '+' symbol (e.g., '+1', '+44', '+972').");

  return (
    <TextField
      required={required}
      helperText={!isValid && showError ? errorMsg : ""}
      error={!isValid && showError}
      value={value}
      fullWidth
      label={label}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: <InputAdornment position="start">{countryCode}</InputAdornment>,
      }}
    />
  );
};

export default PhoneInput;
