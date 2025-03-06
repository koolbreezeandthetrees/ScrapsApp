import "@fontsource/inconsolata";
import { extendTheme } from "@mui/joy/styles";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          // Define your primary color palette here
        },
      },
    },
  },
  fontFamily: {
    display: "Inconsolata, var(--joy-fontFamily-fallback)",
    body: "Inconsolata, var(--joy-fontFamily-fallback)",
  },
});

export default theme;
