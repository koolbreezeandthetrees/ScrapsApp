import "@fontsource/inconsolata";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#e4dc42", // bright yellow
      contrastText: "#fff",
    },
    secondary: {
      main: "#748fb8", // blue
      contrastText: "#fff",
    },
    error: {
      main: "#C06E5E", // indian red
      contrastText: "#fff",
    },
    warning: {
      main: "#CE8647", // dimmed orange
    },
    info: {
      main: "#e5dfdb", // dimmed off white
    },
    success: {
      main: "#ACB67D", // sage
      contrastText: "#fff",
    },
    background: {
      default: "#C7B56C", // ecru
      paper: "rgba(255, 255, 255, 0.14)",
    },
    text: {
      primary: "#FFF5EE", // seashell
      secondary: "#e5dfdb", // dimmed off white
    },
  },
  typography: {
    fontFamily: "Inconsolata, Arial, sans-serif",
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          cursor: "pointer",
          textTransform: "none",
        },
        containedPrimary: {
          backgroundColor: "#e4dc42", // bright yellow
          color: "#fff",
          fontWeight: "bold",
          minWidth: "200px", // ? maybe not ???
          padding: "10px 20px",
          borderRadius: "50px",
          "&:hover": {
            backgroundColor: "#d1cc3b", // darken yellow
          },
        },
        containedSecondary: {
          backgroundColor: "#748fb8", // blue
          color: "#fff",
          fontWeight: "bold",
          minWidth: "200px", // ? maybe not ???
          padding: "10px 20px",
          borderRadius: "50px",
          "&:hover": {
            backgroundColor: "#5f779d", // darken blue
          },
        },
        containedInfo: {
          // backgroundColor: "#FFF5EE", // dimmed off white
          color: "#C7B56C",
          fontWeight: "bold",
          minWidth: "200px",
          padding: "10px 20px",
          borderRadius: "50px",
          "&:hover": {
            backgroundColor: "#E4DC42",
            color: "white",
          },
        },
        text: {
          backgroundColor: "transparent",
          color: "#FFF5EE",
          padding: "4px 6px",
          fontSize: "1.1rem",
          "&:hover": {
            color: "#e5dfdb",
          },
          "&:active": {
            color: "#e5dfdb",
          },
        },
      },
    },
  },
});

export default theme;
