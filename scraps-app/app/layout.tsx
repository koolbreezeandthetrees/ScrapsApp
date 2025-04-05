import {
  ClerkProvider
} from "@clerk/nextjs";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@uploadthing/react/styles.css";

// TODO move header more down the children tree

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">

          <body>
            <Header />
            {children}
            <Footer />
          </body>
        </html>
    </ClerkProvider>
  );
}
