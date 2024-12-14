import { AppBar, Box, Grid2 } from "@mui/material";
import AppNavLink from "../nav-link";
import { useAppSelector } from "../../hooks/redux";

const Header: React.FC = () => {
  const user = useAppSelector((state) => state.user);

  return (
    <AppBar position="relative" sx={{ top: 0, left: 0 }}>
      <Box sx={{ display: "flex", gap: 2, padding: "0 24px" }}>
        {user ? (
          <>
            <Grid2 marginLeft={"auto"}>
              <AppNavLink to="SIGNOUT">Sign Out</AppNavLink>
            </Grid2>
          </>
        ) : (
          <>
            <Grid2>
              <AppNavLink to="SIGNUP">Sign Up</AppNavLink>
            </Grid2>
            <Grid2>
              <AppNavLink to="SIGNIN">Sign In</AppNavLink>
            </Grid2>
          </>
        )}
      </Box>
    </AppBar>
  );
};
export default Header;
