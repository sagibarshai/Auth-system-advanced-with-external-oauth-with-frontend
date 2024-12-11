import { TextField, Tooltip } from "@mui/material";
import { Props as BaseInputProps } from "./types";
import InputErrorMessage from "./input-error-message";

export interface Props extends BaseInputProps {}

const TextInput: React.FC<Props> = ({ stateProps, staticsProps }) => {
  const { errorMsg, label, onChange, required, type } = staticsProps;
  const { isValid, showError, value } = stateProps;

  const shouldShowError = !isValid && showError;

  return (
    <Tooltip title={shouldShowError ? errorMsg : ""} arrow>
      <TextField
        type={type}
        required={required}
        helperText={<InputErrorMessage errorMsg={shouldShowError ? errorMsg : ""} />}
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
