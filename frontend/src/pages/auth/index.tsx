import { Box, Container, Grid } from "@mui/material";
import { useEffect } from "react";
import { NavLink, useNavigate, useNavigation } from "react-router-dom";
import { Outlet } from "react-router-dom";

const AuthPages = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/auth/signup");
  }, []);

  return (
    <Container
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", gap: "24px" }}>
        <Grid>
          <NavLink to={"/auth/signup"}>Signup</NavLink>
        </Grid>
        <Grid>
          <NavLink to={"/auth/signin"}>Signin</NavLink>
        </Grid>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            boxShadow: 3,
            justifyContent: "center",
            alignItems: "center",
            width: "50%",
            height: "auto",
            padding: "24px",
            borderRadius: "6px",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Container>
  );
};

export default AuthPages;
