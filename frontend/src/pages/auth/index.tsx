import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

const AuthPages = () => {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <NavLink to={"/auth/signup"}>Signup</NavLink>
      <NavLink to={"/auth/signin"}>Signin</NavLink>
      <Outlet />
    </div>
  );
};

export default AuthPages;
