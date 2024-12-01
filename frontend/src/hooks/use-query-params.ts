import { useLocation } from "react-router-dom";

const useQueryParams = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const getParam = <T>(key: string): T | undefined => {
    const value = queryParams.get(key);
    if (value === null) return undefined;
    try {
      return JSON.parse(decodeURIComponent(value)) as T;
    } catch {
      return value as T;
    }
  };

  return { getParam };
};

export default useQueryParams;
