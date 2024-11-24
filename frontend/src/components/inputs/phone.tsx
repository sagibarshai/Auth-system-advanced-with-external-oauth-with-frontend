import { InputAdornment, TextField } from "@mui/material";
import { Props } from "./types";

const PhoneInput: React.FC<Props> = ({ stateProps, staticsProps }) => {
  const { errorMsg, label, onChange } = staticsProps;
  const { isValid, showError, value } = stateProps;
  return (
    <TextField
      helperText={!isValid && showError ? errorMsg : ""}
      error={!isValid && showError}
      value={value}
      fullWidth
      label={label}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: <InputAdornment position="start">+972</InputAdornment>,
      }}
    />
  );
};

export default PhoneInput;
