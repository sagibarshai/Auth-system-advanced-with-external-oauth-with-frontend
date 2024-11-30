import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { useCallback, useState } from "react";

interface UseRequestReturn<T, R> {
  loading: boolean;
  data: T | null;
  error: R | null;
  fetchData: () => Promise<void>;
  setErrorManfully: (err: R) => void;
}

interface Props {
  config: AxiosRequestConfig;
  axiosInstance?: AxiosInstance;
}

export const useRequest = <T, R = unknown>({ config, axiosInstance = axios }: Props): UseRequestReturn<T, R> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<R | null>(null);

  const makeRequest = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await axiosInstance.request(config);
      setData(result.data);
    } catch (err: AxiosError | unknown) {
      if (err instanceof AxiosError) setError(err.response?.data);
      else setError(err as R);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = useCallback(makeRequest, [config, axiosInstance]);

  const setErrorManfully = (err: R) => setError(err);

  return { fetchData, loading, data, error, setErrorManfully };
};
