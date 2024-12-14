import { Box } from "@mui/material";

import { Outlet } from "react-router-dom";

const AuthPages = () => {
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex" }}>
      <Outlet />
    </Box>
  );
};

export default AuthPages;
