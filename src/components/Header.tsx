"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blogs", label: "Blogs" },
    { href: "/cases", label: "Cases" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
    { href: "/prices", label: "Pricing" },
    { href: "/reviews", label: "Reviews" },
    { href: "/team", label: "Team" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-2 left-0 right-0 z-50 flex justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 max-w-5xl w-full mx-auto">
        <div className="flex items-center justify-between h-14 px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
          >
            <div className="text-xl font-bold text-gray-900 hover:text-primary transition-colors">
              Brand
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-gray-700 hover:text-primary transition-colors text-sm font-medium",
                    active && "text-primary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <Button asChild variant="default">
              <Link href="/contact">
                Get Started
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[320px] sm:w-[400px] bg-white/95 backdrop-blur-xl border-l border-gray-200/50 shadow-2xl"
              >
                <div className="flex flex-col h-full p-4">
                  {/* Header Section */}
                  <div className="flex items-center space-x-3 mb-8 pt-2 pl-6">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">B</span>
                    </div>
                    <div>
                      <SheetTitle className="text-left text-gray-900 font-bold text-base">
                        Brand
                      </SheetTitle>
                      <SheetDescription className="text-left text-gray-500 text-sm">
                        Your trusted partner
                      </SheetDescription>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col space-y-1 flex-1">
                    {navigationLinks.map((link) => {
                      const active = isActive(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={handleNavigation}
                          className={cn(
                            "group flex items-center px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-primary/10 transition-all duration-200 rounded-xl mx-2 font-medium",
                            active && "bg-primary/10 text-primary"
                          )}
                        >
                          <span className="text-base">
                            {link.label}
                          </span>
                          <div
                            className={cn(
                              "ml-auto transition-opacity",
                              active ? "opacity-100" : "opacity-0",
                              "group-hover:opacity-100"
                            )}
                          >
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          </div>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Mobile CTA Button */}
                  <div className="mb-8 p-4">
                    <div className="text-center">
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={handleNavigation}
                        asChild
                      >
                        <Link href="/contact">
                          Get Started
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
