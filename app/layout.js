import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Welth",
  description: "Your all-in-one finance hub",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          {/*header*/}
          <Header />
          {/*header*/}
          <main className="min-h-screen">{children}</main>
          {/*footer*/}
          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p> Made with ❤️ by Muskan </p>
            </div>
          </footer>
          {/*footer*/}
        </body>
      </html>
    </ClerkProvider>
  );
}
