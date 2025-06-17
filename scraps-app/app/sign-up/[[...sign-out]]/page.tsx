// app/sign-up/page.tsx
"use client";

import { SignUp } from "@clerk/nextjs";
import { Stack } from "@mui/material";

export default function SignUpPage() {
  return (
    <Stack
      component="main"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "70vh",
        p: 4,
        maxWidth: 1200,
        m: "0 auto",
      }}
    >
      
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        forceRedirectUrl="/inventory"
      />
    </Stack>
  );
}
