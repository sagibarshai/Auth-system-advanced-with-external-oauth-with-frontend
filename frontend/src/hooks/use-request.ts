import axios, { Axios, AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { useCallback, useState } from "react";
import { AuthEndPoints } from "../api/backend/auth/endpoints";

interface AppAxiosRequestConfig extends AxiosRequestConfig {
  url: AuthEndPoints;
}

interface UseRequestReturn<T, R> {
  loading: boolean;
  data: T | null;
  error: R | null;
  fetchData: () => Promise<void>;
}

interface Props {
  config: AppAxiosRequestConfig;
  axiosInstance?: AxiosInstance;
}

type Errors<R> = {
  customErrors: R;
  errorResponse: AxiosError;
} | null;

export const useRequest = <T, R = unknown>({ config, axiosInstance = axios }: Props): UseRequestReturn<T, Errors<R>> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Errors<R> | null>(null);

  const makeRequest = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await axiosInstance.request(config);
      setData(result.data);
    } catch (err: AxiosError | unknown) {
      if (err instanceof AxiosError) {
        if (err.response?.status && err.response.status < 400) setData(err.response?.data);
        else setError({ customErrors: err.response?.data as R, errorResponse: err as AxiosError });
      } else setError({ customErrors: err as R, errorResponse: err as AxiosError });
    } finally {
      setLoading(false);
    }
  };

  const fetchData = useCallback(makeRequest, [config, axiosInstance]);

  return { fetchData, loading, data, error };
};
