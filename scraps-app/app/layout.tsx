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
          colorPrimary: "#FFF5EE",
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
            color: "#FFF5EE", // dimmed off white
          },

          dividerLine: {
            backgroundColor: "#e5dfdb", // dimmed off white
          },

          dividerText: {
            color: "#e5dfdb", // dimmed off white
          },

          // 2) Input fields: light border, no inner shadow
          formFieldInput: {
            backgroundColor: "transparent",
            borderColor: "#FFF5EE",
            borderWidth: "1px",
            boxShadow: "none",
            /* override the data-variant rule too: */
            '&[data-variant="default"]': {
              boxShadow: "none",
              borderWidth: "1px",
              borderColor: "#FFF5EE",
            },
            /* and on focus: */
            "&:focus-within": {
              boxShadow: "none",
              borderColor: "#FFF5EE",
            },
          },
          // keep your labels ivory
          formFieldLabel: {
            fontWeight: 600,
            color: "#FFF5EE",
          },

          // primary submit button stays as you had it
          formButtonPrimary: {
            backgroundColor: "#e4dc42",
            borderColor: "#e4dc42",
            color: "#FFF5EE",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            textTransform: "none",

            // ← add a nested rule for hover, focus, active
            "&:hover, &:focus, &:active": {
              backgroundColor: "#d1cc3b",
              borderColor: "#d1cc3b",
              color: "#FFF5EE",
            },
            '&[data-variant="solid"][data-color="primary"]': {
              boxShadow: "none",
              borderWidth: "1px",
              borderColor: "#e4dc42",
            },
          },

          // headings in the forms
          headerTitle: {
            color: "#FFF5EE",
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
            color: "#FFF5EE",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          },
          userPreviewMainIdentifierText: {
            color: "#FFF5EE",
          },
          userPreviewSecondaryIdentifier: {
            color: "#e5dfdb",
          },
          userButtonPopoverActionButton: {
            // make “Manage account” + “Sign out” look like ghost⬦but ivory text
            backgroundColor: "transparent",
            border: "1px solid #FFF5EE",
            color: "#FFF5EE",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          },
          userButtonPopoverFooter: {
            display: "none", // hides the “Secured by Clerk” + “Development mode”
          },
          // —— Profile Page container + header ——
          pageScrollBox: {
            backgroundColor: "#C7B56C",
            boxShadow: "none",
          },
          profilePage: {
            backgroundColor: "transparent",
            color: "#FFF5EE",
          },
          header: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },

          // —— Section wrappers ——
          profileSection: {
            backgroundColor: "#C7B56C",
            boxShadow: "none",
            borderRadius: "12px",
            padding: "1rem",
            marginBottom: "1.5rem",
          },
          profileSectionHeader: {
            marginBottom: "0.5rem",
          },
          profileSectionTitleText: {
            color: "#e5dfdb",
            fontWeight: "600",
          },

          // —— Section content & items ——
          profileSectionContent: {
            color: "#FFF5EE",
          },
          profileSectionItem: {
            "& p": {
              color: "#FFF5EE",
            },
            borderBottom: "1px solid #e5dfdb",
            "&:last-of-type": {
              borderBottom: "none",
            },
          },

          // —— “Update profile”, “Sign out”, “Connect account” buttons ——
          profileSectionPrimaryButton: {
            // ghost style with ivory border/text
            backgroundColor: "transparent",
            border: "1px solid #FFF5EE",
            color: "#FFF5EE",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          },

          // —— Badges (e.g. “Primary”) ——
          badge: {
            backgroundColor: "#e4dc42",
            color: "#FFF5EE",
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
            backgroundColor: "#C7B56C",
            backgroundImage: "none", // kill the gradient
            boxShadow: "none",
            padding: "1rem 2rem",
          },
          navbarTitle: {
            color: "#FFF5EE",
          },
          navbarDescription: {
            color: "#FFF5EE",
          },
          navbarButtons: {
            backgroundColor: "transparent",
            gap: "1rem",
          },
          navbarButton: {
            backgroundColor: "transparent",
            color: "#FFF5EE",
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
        <body>
          <CacheProvider value={clientSideEmotionCache}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SignedIn>
                <Header />
              </SignedIn>
              <Stack
                maxWidth="1400px"
                mx="auto"
                width={"100%"}
                justifyContent={"start"}
                pt={8}
                px={4}
              >
                {children}
              </Stack>
              <Footer />
            </ThemeProvider>
          </CacheProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
