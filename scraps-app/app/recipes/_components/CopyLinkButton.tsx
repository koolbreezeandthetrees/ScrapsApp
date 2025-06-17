// app/recipes/_components/CopyLinkButton.tsx
"use client";

import { useState, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Copy, Check } from "lucide-react";

interface CopyLinkButtonProps {
  recipeId: number;
}

export function CopyLinkButton({ recipeId }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  // Build the absolute URL on the client
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/recipes/${recipeId}`
      : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Reset back to the copy icon after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <Tooltip title={copied ? "Copied!" : "Copy link"} arrow>
      <IconButton
        onClick={handleCopy}
        size="small"
        sx={{
          bgcolor: copied ? "rgba(76, 175, 80, 0.6)" : "transparent",
          "&:hover": {
            bgcolor: copied
              ? "rgba(76, 175, 80, 0.6)"
              : "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
      </IconButton>
    </Tooltip>
  );
}
