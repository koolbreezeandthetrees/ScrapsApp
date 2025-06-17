// app/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { Button, Typography, Box, Stack, NoSsr } from "@mui/material";
import { Refrigerator } from "lucide-react";
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
           alignItems="center"
           justifyContent="center"
           spacing={3}
           sx={{ width: "100%", minHeight: "60vh", textAlign: "center", px: 2 }}
         >
      
          <Box>
            <Refrigerator
              size={64}
              strokeWidth={1.5}
              className="text-primary"
            />
          </Box>

            <Typography variant="h4" component="h1">
              Welcome to Scraps
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 600 }}>
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
  </NoSsr >
  );
}
