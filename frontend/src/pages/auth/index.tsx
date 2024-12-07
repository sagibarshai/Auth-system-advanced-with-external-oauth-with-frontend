import { Box, Container } from "@mui/material";

import { Outlet } from "react-router-dom";

const AuthPages = () => {
  return (
    <Container
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Outlet />
    </Container>
  );
};

export default AuthPages;
