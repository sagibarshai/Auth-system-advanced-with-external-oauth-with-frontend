import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { createTheme, CssBaseline, Container, ThemeProvider } from "@mui/material";

const App = () => {
  const navigate = useNavigate();

  const theme = createTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "#root": {
            height: "100vh",
            width: "100vw",
          },
          "*": {
            margin: 0,
            padding: 0,
          },
        },
      },
    },
  });

  const getCurrentUser = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/auth/currentUser", {
        withCredentials: true,
      });
      const user = response.data;

      navigate("/home");
    } catch (err) {
      navigate("/auth");
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ width: "100vw", height: "100vh" }} disableGutters>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
};

export default App;
