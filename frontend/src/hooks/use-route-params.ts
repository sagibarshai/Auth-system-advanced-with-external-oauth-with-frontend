import { useParams } from "react-router-dom";

const useRouteParams = <T>() => {
  const params = useParams();

  const getRouteParams = (key: string): T | undefined => {
    return params[key] as T;
  };

  return { params, getRouteParams };
};

export default useRouteParams;
