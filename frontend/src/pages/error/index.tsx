import { useEffect } from "react";
import { useAppRouter } from "../../hooks/router";

const ErrorPage: React.FC = () => {
  const { appNavigate } = useAppRouter();

  useEffect(() => {
    appNavigate("ROOT");
  }, []);

  return null;
};

export default ErrorPage;
