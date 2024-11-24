import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

const App = () => {
  const navigate = useNavigate();

  const getCurrentUser = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/auth/currentUser", {
        withCredentials: true,
      });
      const user = response.data;

      navigate("/home");
    } catch (err) {
      // navigate("/auth");
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  return <Outlet />;
};

export default App;
