import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import React from "react";
// import { Button } from "./ui/button";
// import { PenBox, LayoutDashboard } from "lucide-react";
// import Link from "next/link";
//import { checkUser } from "@/lib/checkUser";
//import Image from "next/image";

const Header = async () => {
    //   await checkUser();

    return (
        <div>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>

  );
};

export default Header;
