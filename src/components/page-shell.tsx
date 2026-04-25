import { SiteHeader, SiteFooter } from "./site-chrome";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Elegant blurred ambient lighting */}
        <div className="absolute top-0 right-0 h-[800px] w-[800px] -translate-y-1/4 translate-x-1/4 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] translate-y-1/4 -translate-x-1/4 rounded-full bg-secondary/10 blur-[100px]" />
      </div>
      <SiteHeader />
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 pt-32 pb-16"
      >
        {children}
      </motion.main>
      <SiteFooter />
    </div>
  );
}
