import { Container } from "@mui/material";

import { Outlet } from "react-router-dom";

const AuthPages = () => {
  return (
    <Container sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignContent: "center" }}>
      <Outlet />
    </Container>
  );
};

export default AuthPages;
