"use client";

import React, { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import ConnectWallet from "./Connect";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MonitorDown, Folder } from "lucide-react";
import NetworkSwitcher from "./NetworkSwitcher";

function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const NavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <Button variant="outline" size="sm" className="flex  flex-row items-center">
      <Link
        href={href}
        className={`text-lg inline-block ${
          isActive(href) ? "text-primary" : "text-muted-foreground"
        } hover:text-primary transition-colors`}
        onClick={() => setIsOpen(false)}
      >
        {children}
      </Link>
    </Button>
  );

  const NavContent = () => (
    <>
      <NavLink href="/files">
        <Folder className="h-6 w-6 inline-block mr-2" />
        Files
      </NavLink>
      <div className="flex items-center gap-4">
        <NetworkSwitcher />
        <ConnectWallet />
        <ModeToggle />
      </div>
    </>
  );

  return (
    // make the navbar sticky
    <nav className="flex justify-between items-center px-4 py-1 bg-primary-foreground text-text shadow-md sticky top-0 z-10">
      <Link className="text-lg text-text font-bold flex items-center" href="/">
        <Image
          src="/images/ssv_logo.png"
          alt="SSV Logo"
          width={32}
          height={32}
          className="inline-block mr-2"
        />
        Ceremonia
      </Link>

      <NavLink href="/download">
        <MonitorDown className="h-6 w-6 mr-2 inline-block" />
        Download
      </NavLink>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <NavContent />
      </div>

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[300px] sm:w-[400px]" side="right">
          <div className="flex flex-col gap-6 mt-6">
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}

export default NavBar;
