import "@fontsource/inconsolata";
import { createTheme } from "@mui/material/styles";
import { BLUE, DARKEN_BLUE, DARKEN_YELLOW, DIMMED_OFF_WHITE, DIMMED_ORANGE, ECRU, INDIAN_RED, SAGE, SEASHELL, YELLOW } from "./gloabalStyles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: YELLOW,
      contrastText: "#fff",
    },
    secondary: {
      main: BLUE,
      contrastText: "#fff",
    },
    error: {
      main: INDIAN_RED,
      contrastText: "#fff",
    },
    warning: {
      main: DIMMED_ORANGE,
    },
    info: {
      main: DIMMED_OFF_WHITE,
    },
    success: {
      main: SAGE,
      contrastText: "#fff",
    },
    background: {
      default: ECRU,
      paper: "rgba(255, 255, 255, 0.14)",
    },
    text: {
      primary: SEASHELL,
      secondary: DIMMED_OFF_WHITE,
    },
  },
  typography: {
    fontFamily: "Inconsolata, Arial, sans-serif",
  },
  components: {
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
        disableFocusRipple: true,
      },
      styleOverrides: {
        root: {
          cursor: "pointer",
          color: SEASHELL,
          "&:hover": {
            color: DIMMED_OFF_WHITE,
          },
          "&:active": {
            color: DIMMED_OFF_WHITE,
          },
          "&.Mui-disabled": {
            color: ECRU,
            cursor: "not-allowed",
          },
        },
      },
    },
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
          backgroundColor: YELLOW, // bright yellow
          color: "#fff",
          fontWeight: "bold",
          minWidth: "200px", // ? maybe not ???
          padding: "10px 20px",
          borderRadius: "50px",
          "&:hover": {
            backgroundColor: DARKEN_YELLOW, // darken yellow
          },
        },
        containedSecondary: {
          backgroundColor: BLUE, // blue
          color: "#fff",
          fontWeight: "bold",
          minWidth: "200px", // ? maybe not ???
          padding: "10px 20px",
          borderRadius: "50px",
          "&:hover": {
            backgroundColor: DARKEN_BLUE, // darken blue
          },
        },
        containedInfo: {
          // backgroundColor: "#FFF5EE", // dimmed off white
          color: ECRU,
          fontWeight: "bold",
          minWidth: "200px",
          padding: "10px 20px",
          borderRadius: "50px",
          "&:hover": {
            backgroundColor: YELLOW,
            color: "white",
          },
        },
        text: {
          backgroundColor: "transparent",
          color: SEASHELL,
          padding: "4px 6px",
          fontSize: "1.1rem",
          "&:hover": {
            color: DIMMED_OFF_WHITE,
          },
          "&:active": {
            color: DIMMED_OFF_WHITE,
          },
        },
      },
    },
  },
});

export default theme;
