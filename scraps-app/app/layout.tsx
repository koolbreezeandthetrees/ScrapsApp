"use client";
import {
  ClerkProvider
} from "@clerk/nextjs";
import "./_styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@uploadthing/react/styles.css";
import theme from "@/theme";
import { ThemeProvider } from "@emotion/react";

// TODO move header more down the children tree

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ThemeProvider theme={theme}>
        <html lang="en">
          <body>
            <Header />
            <div className="container">{children}</div>

            <Footer />
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}
