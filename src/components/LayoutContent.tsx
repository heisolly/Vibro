"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Routes where the landing Navbar/Footer should NOT be shown
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuth = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");
  const isHome = pathname === "/";
  const hideStandardNav = isDashboard || isAuth || isHome;


  return (
    <div className="relative flex min-h-screen flex-col">
      {!hideStandardNav && <Navbar />}
      <main className={`flex-1 ${!hideStandardNav ? "pt-24" : ""}`}>
        {children}
      </main>
      {!hideStandardNav && <Footer />}
    </div>
  );
}
