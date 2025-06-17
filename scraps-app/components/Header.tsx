import { SignedIn, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import {
  BookOpenText,
  Calculator,
  Carrot,
  CircleUserRound,
  LogOut,
} from "lucide-react";
import { IconButton } from "@mui/material";

export default function Header() {
  const clerk = useClerk();

  return (
      <Stack
        direction="row"
        justifyContent="space-between"
      alignItems="center"
      width={"100%"}
        maxWidth="1500px"
        className="pt-2 px-8 mx-auto"
      >
        {/* Logo */}
        <Stack direction="row" alignItems="center" className="gap-1">
          <Image
            src="/icons/logo.svg"
            alt="Peanut logo"
            width={35}
            height={35}
            className="w-9 h-9"
          />
          <p className="text-3xl font-kulim font-light tracking-wider">
            SCRAPS
          </p>
        </Stack>

        <SignedIn>
          <Stack direction="row" alignItems="center" className="gap-4 ml-auto">
            <Link href="/inventory" className="flex items-center gap-2">
              <Carrot size={25} />
              <span className="hidden md:inline text-2xl">inventory</span>
            </Link>

            <Link href="/recipes" className="flex items-center gap-2">
              <BookOpenText size={25} />
              <span className="hidden md:inline text-2xl">recipes</span>
            </Link>

            <Link href="/calculate" className="flex items-center gap-2">
              <Calculator size={25} />
              <span className="hidden md:inline text-2xl">calculate</span>
            </Link>

            {/* Profile & SignOut Icons */}
            <IconButton size="large" onClick={() => clerk.openUserProfile()}>
              <CircleUserRound size={25} />
            </IconButton>
            <IconButton size="large" onClick={() => void clerk.signOut()}>
              <LogOut size={25} />
            </IconButton>
          </Stack>
        </SignedIn>
      </Stack>
  );
}
