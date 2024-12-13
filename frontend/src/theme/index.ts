import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    background: {
      default: "white",
    },
  },
  typography: {
    allVariants: {},
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f9fcff",
          backgroundImage: "linear-gradient(147deg, #f9fcff 0%, #dee4ea 74%);",
        },
      },
    },

    MuiFormControl: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: "white",
          display: "flex",
          boxShadow: "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
          height: "auto",
          padding: theme.spacing(3),
          borderRadius: "2%",
          margin: "auto",
          gap: theme.spacing(2),
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
