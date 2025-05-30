"use client";

import { ClerkProvider } from "@clerk/nextjs";
import "@uploadthing/react/styles.css";
import "./_styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import createEmotionCache from "@/utils/emotionCache";
import { CacheProvider } from "@emotion/react";
import theme from "@/utils/theme/theme";

const clientSideEmotionCache = createEmotionCache();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <CacheProvider value={clientSideEmotionCache}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Header />
              <div className="container">{children}</div>
              <Footer />
            </ThemeProvider>
          </CacheProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
