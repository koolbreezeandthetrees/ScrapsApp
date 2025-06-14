// app/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { Button, Typography, Box, Stack, NoSsr } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  // Prevent any flash-of-unstyled / Clerk fallbacks
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <NoSsr>
      <Stack
        component="main"
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 1, md: 2 }}
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: "100vh",
          maxWidth: 1200,
          mx: "auto",
          px: 4,
        }}
      >
        {/* Illustration Column */}
        <Box
          sx={{
            flex: "2 1 0%",
            position: "relative",
            width: "100%",
            height: { xs: 300, md: 500 },
          }}
        >
          <Image
            src="/scraps-welcome-illustration.png"
            alt="Food ingredients illustration"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </Box>

        {/* Welcome Panel */}
        <Box
          sx={{
            flex: "1 1 0%",
            width: "100%",
            maxWidth: 500,
          }}
        >
          <Stack spacing={2} alignItems="flex-start">
            <Typography variant="h3" component="h1">
              Welcome to Scraps
            </Typography>
            <Typography variant="h6" color="text.primary">
              Never let ingredients go to waste again: manage your inventory,
              store recipes, and automatically calculate missing items.
            </Typography>

            {/* Only show these when NOT signed in */}
            {!isSignedIn && isLoaded && (
              <Stack direction="row" spacing={2} pt={2}>
                <Button
                  variant="contained"
                  color="info"
                  size="large"
                  onClick={() => router.push("/sign-up")}
                >
                  Sign Up
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => router.push("/sign-in")}
                >
                  Log In
                </Button>
              </Stack>
            )}
          </Stack>
        </Box>
      </Stack>
    </NoSsr>
  );
}
