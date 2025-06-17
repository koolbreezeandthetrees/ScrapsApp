import React from "react";
import { Stack, Typography, Button, Box } from "@mui/material";
import { Refrigerator } from "lucide-react";

interface CreateInvProps {
  onCreate: () => void;
}

export default function CreateInv({ onCreate }: CreateInvProps) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={3}
      sx={{ width: "100%", minHeight: "60vh", textAlign: "center", px: 2 }}
    >
      {/* Fridge Icon */}
      <Box>
        <Refrigerator size={64} strokeWidth={1.5} className="text-primary" />
      </Box>

      {/* Intro Text */}
      <Typography variant="h4" component="h2">
        Welcome to Your Scraps Inventory!
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 600 }}>
        Get started by creating your personal inventory. Track your ingredients, add your own recipes, or explore our shared
        recipe database. We&apos;ll help you choose meals that make the most of
        what you already have, cutting food
        waste, and keeping your budget on track.
      </Typography>

      {/* Create Button */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={onCreate}
        sx={{ px: 4, py: 1.5 }}
      >
        Create Inventory
      </Button>
    </Stack>
  );
}
