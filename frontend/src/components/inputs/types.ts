export interface Props {
  staticsProps: {
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
