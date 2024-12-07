import { useEffect } from "react";
import { useRequest } from "../../hooks/use-request";
import { backendAxiosInstance } from "../../api/backend/auth/backend-axios-instance";
import { AuthEndPoints } from "../../api/backend/auth/endpoints";
import { useAppRouter } from "../../hooks/router";
import { useAppDispatch } from "../../hooks/redux";
import { clearUser } from "../../redux/features/user";

const SignOutPage: React.FC = () => {
  const { appNavigate } = useAppRouter();
  const dispatch = useAppDispatch();
  const { data, fetchData } = useRequest({
    config: {
      url: AuthEndPoints["SIGNOUT"],
      method: "post",
    },
    axiosInstance: backendAxiosInstance,
  });
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      appNavigate("SIGNIN");
      dispatch(clearUser());
    }
  }, [data]);

  return null;
};
export default SignOutPage;
