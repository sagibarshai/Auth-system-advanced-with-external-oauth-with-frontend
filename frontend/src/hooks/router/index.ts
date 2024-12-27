import { useCallback } from "react";
import { NavigateOptions, useLocation, useNavigate, useParams } from "react-router-dom";
import { CustomErrorMessage } from "../../api/backend/auth/types";
import { Pages } from "../../router";

interface AppNavigateOptions<T> extends NavigateOptions {
  state: PageState<T>;
}

interface PageState<T> {
  info?: string[];
  errors?: CustomErrorMessage;
  success?: string[];
  data?: T;
}

export const useAppRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // navigate
  const appNavigate = useCallback(<T>(to: keyof typeof Pages, options?: AppNavigateOptions<T>) => {
    navigate(Pages[to], options);
  }, []);

  // get page state
  const getPageState = useCallback(<T>(): PageState<T> => {
    return {
      errors: location?.state?.errors,
      info: location?.state?.info,
      success: location?.state?.success,
      data: location?.state?.data as T,
    };
  }, []);

  // get query params
  const queryParams = new URLSearchParams(location.search);

  const getParam = <T>(key: string): T | undefined => {
    const value = queryParams.get(key);
    if (value === null) return undefined;
    try {
      return JSON.parse(decodeURIComponent(value)) as T;
    } catch {
      return value as T;
    }
  };

  // get route params
  const getRouteParams = <T>(key: string): T | undefined => {
    return params[key] as T;
  };

  // get path name
  const getPathName = () => location.pathname;

  return { appNavigate, getPageState, getParam, getRouteParams, getPathName };
};
