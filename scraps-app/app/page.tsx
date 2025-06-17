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

  // Prevent flash-of-unstyled
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <NoSsr>
      <Stack
        component="main"
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 2, md: 4 }}
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: "70vh",
          mx: "auto",
          px: 4,
        }}
      >
        {/* Illustration Column */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 800,
          }}
        >
          <Image
            src="/scraps-welcome-illustration.png"
            alt="Food ingredients illustration"
            width={800}
            height={600}
          />
        </Box>

        {/* Welcome Panel */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 800,
          }}
        >
          <Stack
            spacing={2}
            justifyContent="flex-start"
            alignItems={{ xs: "center", md: "flex-start" }}
          >
            <Typography variant="h3" component="h1">
              Welcome to Scraps
            </Typography>
            <Typography
              variant="h6"
              color="text.primary"
              align="center"
              sx={{
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Never let ingredients go to waste again: manage your inventory,
              store recipes, and automatically calculate missing items.
            </Typography>

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
