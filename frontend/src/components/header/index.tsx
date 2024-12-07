import { AppBar, Box, Grid } from "@mui/material";
import AppNavLink from "../nav-link";
import { useAppSelector } from "../../hooks/redux";

const Header: React.FC = () => {
  const user = useAppSelector((state) => state.user);

  return (
    <AppBar>
      <Box sx={{ display: "flex", gap: 2, padding: "0 24px" }}>
        {user ? (
          <>
            <Grid marginLeft={"auto"}>
              <AppNavLink to="SIGNOUT">Sign Out</AppNavLink>
            </Grid>
          </>
        ) : (
          <>
            <Grid>
              <AppNavLink to="SIGNUP">Sign Up</AppNavLink>
            </Grid>
            <Grid>
              <AppNavLink to="SIGNIN">Sign In</AppNavLink>
            </Grid>
          </>
        )}
      </Box>
    </AppBar>
  );
};
export default Header;
