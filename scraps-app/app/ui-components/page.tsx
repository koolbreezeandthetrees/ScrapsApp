"use client";

import { Button, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import CreateInv from "../inventory/_components/createInv";

export default function UiPage() { 
  return (
    <Stack>
      <Typography variant="h1">Header 1</Typography>
      <Typography variant="h2">Header 2</Typography>
      <Typography variant="h3">Header 3</Typography>
      <Typography variant="h4">Header 4</Typography>
      <Typography variant="h5">Header 5</Typography>
      <Typography variant="h6">Header 6</Typography>
      <Typography variant="body1">Body 1</Typography>
      <Typography variant="body2">Body 2</Typography>
      <Typography variant="caption">Caption</Typography>
      <Button variant="contained" color="primary">
        Primary Button
      </Button>
      <Button variant="contained" color="secondary">
        Secondary Button
      </Button>
      <CreateInv onCreate={() => {
        alert("Create Inventory Clicked");
      }} />
    </Stack>
  );
}
