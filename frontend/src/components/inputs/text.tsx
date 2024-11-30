import { TextField } from "@mui/material";
import { Props as BaseInputProps } from "./types";

export interface Props extends BaseInputProps {}

const TextInput: React.FC<Props> = ({ stateProps, staticsProps }) => {
  const { errorMsg, label, onChange, required, type } = staticsProps;
  const { isValid, showError, value } = stateProps;
  return (
    <TextField
      type={type}
      required={required}
      helperText={!isValid && showError ? errorMsg : ""}
      error={!isValid && showError}
      value={value}
      fullWidth
      label={label}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default TextInput;
