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
      <Box sx={{ display: "flex", gap: "24px" }}></Box>
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
