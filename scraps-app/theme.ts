"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Inconsolata", monospace',
  },
  palette: {
    mode: "light",
    background: {
      default: "#C7B56C",
    },
    text: {
      primary: "#FFFFFF",
    },
  },
});

export default theme;
