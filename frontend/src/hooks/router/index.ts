import { useCallback } from "react";
import { NavigateOptions, useLocation, useNavigate, useParams } from "react-router-dom";
import { CustomErrorMessage } from "../../api/backend/auth/types";
import { Pages } from "../../router";

interface AppNavigateOptions extends NavigateOptions {
  state: PageState;
}

interface PageState {
  info?: string[];
  errors?: CustomErrorMessage;
  success?: string[];
}

export const useAppRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // navigate
  const appNavigate = useCallback((to: keyof typeof Pages, options?: AppNavigateOptions) => {
    navigate(Pages[to], options);
  }, []);

  // page state
  const getPageState = useCallback((): PageState => {
    return {
      errors: location?.state?.errors,
      info: location?.state?.info,
      success: location?.state?.success,
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
