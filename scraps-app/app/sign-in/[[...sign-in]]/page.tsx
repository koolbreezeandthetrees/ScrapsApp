// app/sign-in/[[...sign-in]]/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";
import { Stack } from "@mui/material";

export default function SignInPage() {
  return (
    <Stack
      component="main"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "60vh",
        p: 4,
        maxWidth: 1200,
        m: "0 auto",
      }}
    >
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        forceRedirectUrl="/inventory"
      />
    </Stack>
  );
}
