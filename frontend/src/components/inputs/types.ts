export interface Props {
  staticsProps: {
    required: boolean;
    label: string;
    onChange: (value: string) => void;
    errorMsg: string;
  };
  stateProps: {
    value: string;
    isValid: boolean;
    showError: boolean;
  };
}
