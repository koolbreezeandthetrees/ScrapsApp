import {
  SignedIn,
  useClerk,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import { BookOpenText, Calculator, Carrot, CircleUserRound, LogOut } from "lucide-react";
import { IconButton, Typography } from "@mui/material";

export default function Header() {
  const clerk = useClerk();

  return (
    <header>
      {/* Navbar container: use MUI Stack for layout and Tailwind for spacing */}
      <Stack
        component="nav"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        className="pt-2 container mx-auto"
      >
        {/* Logo section */}
        <Stack direction="row" alignItems="center" className="m-0 p-0 gap-1">
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

        {/* Navigation (when signed in) */}
        <SignedIn>
          <Stack
            direction="row"
            alignItems="center"
            className="m-0 p-4 gap-5 ml-auto"
          >
            <Link
              href="/inventory"
              className="flex items-center text-2xl gap-2"
            >
              <Carrot size={25} />
              <Typography variant="h5" pr={1}>
                inventory
              </Typography>
            </Link>

            <Link href="/recipes" className="flex items-center text-2xl gap-2">
              <BookOpenText size={25} />
              <Typography variant="h5" pr={1}>
                recipes
              </Typography>
            </Link>

            <Link
              href="/calculate"
              className="flex items-center text-2xl gap-2"
            >
              <Calculator size={25} />
              <Typography variant="h5" pr={1}>
                calculate
              </Typography>
            </Link>
            
          </Stack>
          {/* open user profile on icon click */}
          <IconButton size="large" onClick={() => clerk.openUserProfile()}>
            <CircleUserRound size={25} />
          </IconButton>
          {/* Sign-out as icon only */}
          <IconButton size="large" onClick={() => void clerk.signOut()}>
            <LogOut size={25} />
          </IconButton>
        </SignedIn>
      </Stack>
    </header>
  );
}
