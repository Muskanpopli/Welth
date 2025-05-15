import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";

import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

export const metadata = {
  title: "Welth",
  description: "Your all-in-one finance hub",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body className={"font-sans"}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          {/*footer*/}
          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p> Final Year CSE Project </p>
            </div>
          </footer>
          {/*footer*/}
        </body>
      </html>
    </ClerkProvider>
  );
}
