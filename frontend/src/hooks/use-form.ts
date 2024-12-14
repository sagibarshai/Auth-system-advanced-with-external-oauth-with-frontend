import { useEffect, useState } from "react";
import { Props as TextInputProps } from "../components/inputs/text";

interface Props<T extends TextInputProps["stateProps"]> {
  inputs: T[];
}

export const useForm = <T extends TextInputProps["stateProps"]>({ inputs }: Props<T>) => {
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const checkFormValidation = (inputs: T[]): boolean => {
    return inputs.every((input) => input.isValid);
  };

  useEffect(() => {
    const isValid = checkFormValidation(inputs);
    setIsFormValid(isValid);
  }, [inputs]);

  return { isFormValid };
};
