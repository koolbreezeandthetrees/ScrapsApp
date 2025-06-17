// scraps-app/app/layout.tsx

"use client";

import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import "@uploadthing/react/styles.css";
import "./_styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Stack } from "@mui/material";
import createEmotionCache from "@/utils/emotionCache";
import { CacheProvider } from "@emotion/react";
import theme from "@/utils/theme/theme";
import { DARKEN_YELLOW, DIMMED_OFF_WHITE, ECRU, SEASHELL, YELLOW } from "@/utils/theme/gloabalStyles";

const clientSideEmotionCache = createEmotionCache();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: SEASHELL,
          fontFamily: "'Inter', sans-serif",
        },
        elements: {
          // 1) Card: transparent dark + no shadow
          card: {
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            boxShadow: "none",
            borderRadius: "16px",
            padding: "2rem",
          },
          cardBox: {
            boxShadow: "none",
          },

          headerSubtitle: {
            color: SEASHELL, // dimmed off white
          },

          dividerLine: {
            backgroundColor: DIMMED_OFF_WHITE,
          },

          dividerText: {
            color: DIMMED_OFF_WHITE,
          },

          // 2) Input fields: light border, no inner shadow
          formFieldInput: {
            backgroundColor: "transparent",
            borderColor: SEASHELL,
            borderWidth: "1px",
            boxShadow: "none",
            /* override the data-variant rule too: */
            '&[data-variant="default"]': {
              boxShadow: "none",
              borderWidth: "1px",
              borderColor: DIMMED_OFF_WHITE,
            },
            /* and on focus: */
            "&:focus-within": {
              boxShadow: "none",
              borderColor: SEASHELL,
            },
          },
          // keep your labels ivory
          formFieldLabel: {
            fontWeight: 600,
            color: SEASHELL,
          },

          // primary submit button stays as you had it
          formButtonPrimary: {
            backgroundColor: YELLOW,
            borderColor: YELLOW,
            color: "#fff",
            fontSize: "1rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            textTransform: "none",

            // ← add a nested rule for hover, focus, active
            "&:hover, &:focus, &:active": {
              backgroundColor: DARKEN_YELLOW,
              borderColor: DARKEN_YELLOW,
              color: SEASHELL,
            },
            '&[data-variant="solid"][data-color="primary"]': {
              boxShadow: "none",
              borderWidth: "1px",
              borderColor: YELLOW,
            },
          },

          // headings in the forms
          headerTitle: {
            color: SEASHELL,
          },

          // social buttons with white bg
          socialButtonsIconButton: {
            backgroundColor: "#FFFFFF",
            color: "#000000",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
            "& .cl-providerIcon": {
              filter: "none",
            },
          },
          formFooter: {
            display: "none",
          },
          cardFooter: {
            display: "none",
          },
          userButtonPopoverCard: {
            backgroundColor: "rgba(0, 0, 0, 0)",
            boxShadow: "none",
            borderRadius: "16px",
            padding: "1rem",
          },
          userButtonPopoverMain: {
            color: SEASHELL,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          },
          userPreviewMainIdentifierText: {
            color: SEASHELL,
          },
          userPreviewSecondaryIdentifier: {
            color: DIMMED_OFF_WHITE,
          },
          userButtonPopoverActionButton: {
            // make “Manage account” + “Sign out” look like ghost⬦but ivory text
            backgroundColor: "transparent",
            border: `1px solid ${SEASHELL}`,
            color: SEASHELL,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          },
          userButtonPopoverFooter: {
            display: "none", // hides the “Secured by Clerk” + “Development mode”
          },
          // —— Profile Page container + header ——
          pageScrollBox: {
            backgroundColor: ECRU,
            boxShadow: "none",
          },
          profilePage: {
            backgroundColor: "transparent",
            color: SEASHELL,
          },
          header: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },

          // —— Section wrappers ——
          profileSection: {
            backgroundColor: ECRU,
            boxShadow: "none",
            borderRadius: "12px",
            padding: "1rem",
            marginBottom: "1.5rem",
          },
          profileSectionHeader: {
            marginBottom: "0.5rem",
          },
          profileSectionTitleText: {
            color: DIMMED_OFF_WHITE,
            fontWeight: "600",
          },

          // —— Section content & items ——
          profileSectionContent: {
            color: SEASHELL,
          },
          profileSectionItem: {
            "& p": {
              color: SEASHELL,
            },
            borderBottom: `1px solid ${DIMMED_OFF_WHITE}`,
            "&:last-of-type": {
              borderBottom: "none",
            },
          },

          // —— “Update profile”, “Sign out”, “Connect account” buttons ——
          profileSectionPrimaryButton: {
            // ghost style with ivory border/text
            backgroundColor: "transparent",
            border: `1px solid ${SEASHELL}`,
            color: SEASHELL,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          },

          // —— Badges (e.g. “Primary”) ——
          badge: {
            backgroundColor: YELLOW,
            color: SEASHELL,
          },

          // —— Provider icons (Google, etc.) ——
          providerIcon: {
            filter: "brightness(0) invert(1)",
          },

          // —— Hide Clerk’s built-in footer (“Secured by”, “Dev mode”) ——
          profileSectionFooter: {
            display: "none",
          },
          navbar: {
            backgroundColor: ECRU,
            backgroundImage: "none", // kill the gradient
            boxShadow: "none",
            padding: "1rem 2rem",
          },
          navbarTitle: {
            color: SEASHELL,
          },
          navbarDescription: {
            color: SEASHELL,
          },
          navbarButtons: {
            backgroundColor: "transparent",
            gap: "1rem",
          },
          navbarButton: {
            backgroundColor: "transparent",
            color: SEASHELL,
            borderRadius: "8px",
            "&:hover, &:focus": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
            // Highlight the active tab
            "&[data-active='true']": {
              color: "#FFF",
            },
          },
          navbarButtonText: {
            color: "#FFF",
          },
          navbarButtonIcon: {
            color: "inherit",
          },
        },
        layout: {
          logoPlacement: "inside",
          socialButtonsVariant: "iconButton",
        },
      }}
    >
      <html lang="en">
        <body className="flex flex-col min-h-screen">
          <CacheProvider value={clientSideEmotionCache}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SignedIn>
                <Header />
              </SignedIn>
              <main className="flex-grow">
                <Stack
                  maxWidth="1500px"
                  mx="auto"
                  width={"100%"}
                  justifyContent={"start"}
                  pt={8}
                  px={4}
                >
                  {children}
                </Stack>
              </main>
              <Footer />
            </ThemeProvider>
          </CacheProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
