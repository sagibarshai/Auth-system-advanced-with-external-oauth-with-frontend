import { NavLink } from "react-router-dom";
import { Pages } from "../../router";
import { Typography } from "@mui/material";

interface Props extends React.PropsWithChildren {
  to: keyof typeof Pages;
}

const AppNavLink: React.FC<Props> = ({ to, children }) => {
  return (
    <NavLink to={Pages[to]} style={{ textDecoration: "none" }}>
      {({ isActive }) => (
        <Typography
          sx={{
            color: "white",
            textDecoration: "underline",
            fontWeight: isActive ? "bold" : "regular",
            fontSize: "18px",
            padding: "12px 8px",
          }}
        >
          {children}
        </Typography>
      )}
    </NavLink>
  );
};
export default AppNavLink;
