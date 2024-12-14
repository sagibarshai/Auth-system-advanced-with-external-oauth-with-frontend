import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    background: {
      default: "#fffffd",
    },
  },

  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: 0,
          margin: 0,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: "white",
          boxShadow: "hsla(220, 30%, 5%, 0.05) 0px 5px 25px 30px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
          padding: theme.spacing(4),
          gap: theme.spacing(2),
          borderRadius: "2%",
          margin: "auto",
        }),
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: "5%",
          backgroundImage: "none",
          display: "block",
          boxShadow: "none",
          justifyContent: "start",
          alignItems: "start",
          width: "auto",
          padding: theme.spacing(0),
          margin: 0,
        }),
      },
    },
  },
});
