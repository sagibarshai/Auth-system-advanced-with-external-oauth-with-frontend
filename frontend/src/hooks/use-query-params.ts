import { useLocation } from "react-router-dom";

const useQueryParams = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const getParam = <T>(key: string): T | undefined => {
    const value = queryParams.get(key);
    return value !== null ? (JSON.parse(value) as T) : undefined;
  };

  return { getParam };
};

export default useQueryParams;
