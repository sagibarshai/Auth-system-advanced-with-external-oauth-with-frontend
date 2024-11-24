import { useMemo, useState } from "react";
import { Props as InputProps } from "../components/inputs/types";

export const useInput = ({
  stateProps,
  staticsProps,
}: InputProps): [InputProps["stateProps"], React.Dispatch<React.SetStateAction<InputProps["stateProps"]>>, InputProps["staticsProps"]] => {
  const statics = useMemo(() => ({ ...staticsProps }), [staticsProps]);
  const [state, setState] = useState<InputProps["stateProps"]>(stateProps);

  return [state, setState, statics];
};
