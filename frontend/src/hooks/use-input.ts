import { useMemo, useState } from "react";

type ObjectKey = string | number;

interface Props {
  staticsProps: Record<ObjectKey, any>;
  stateProps: Record<ObjectKey, any>;
}

export const useInput = <T extends Props>({
  stateProps,
  staticsProps,
}: T): [T["stateProps"], React.Dispatch<React.SetStateAction<T["stateProps"]>>, T["staticsProps"]] => {
  const statics = useMemo(() => ({ ...staticsProps }), []);
  const [state, setState] = useState<T["stateProps"]>(stateProps);

  return [state, setState, statics];
};
