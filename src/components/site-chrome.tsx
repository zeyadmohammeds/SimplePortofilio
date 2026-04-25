import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/lib/mode-context";
import {
  ArrowUpRight,
  Code2,
  Github,
  Linkedin,
  Menu,
  Moon,
  Sparkles,
  Sun,
  User,
  X,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Magnetic } from "./ui/magnetic";

export const userNav = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/education", label: "Education" },
  { to: "/contact", label: "Contact" },
] as const;

const devNav = [
  { to: "/dev", label: "Console" },
  { to: "/dev/upload", label: "Upload" },
  { to: "/dev/architecture", label: "Architecture" },
] as const;

function ModeToggle({ className = "" }: { className?: string }) {
  const { mode, toggleMode } = useApp();
  const isDev = mode === "developer";

  return (
    <button
      onClick={toggleMode}
      className={`relative flex h-9 items-center rounded-full p-1 border border-border bg-card/50 backdrop-blur-md transition-all ${className}`}
      aria-label="Toggle mode"
    >
      <div className="relative z-10 flex w-[120px] items-center text-[11px] font-medium tracking-wide">
        <div className={`flex flex-1 items-center justify-center gap-1.5 transition-colors duration-300 ${!isDev ? "text-primary-foreground" : "text-muted-foreground"}`}>
          <User className="h-3 w-3" />
          User
        </div>
        <div className={`flex flex-1 items-center justify-center gap-1.5 transition-colors duration-300 ${isDev ? "text-primary-foreground" : "text-muted-foreground"}`}>
          <Code2 className="h-3 w-3" />
          Dev
        </div>
      </div>
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-primary"
        style={{ left: isDev ? "calc(50%)" : "4px" }}
      />
    </button>
  );
}

export function SiteHeader() {
  const { mode, theme, toggleTheme, isAdmin } = useApp();
  const nav = mode === "user" ? userNav : devNav;
  const loc = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [triggering, setTriggering] = useState(false);

  useEffect(() => setMobileOpen(false), [loc.pathname]);

  useEffect(() => {
    let keys = "";
    const handler = (event: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      keys += event.key;
      if (keys.length > 5) keys = keys.slice(-5);
      if (keys.toLowerCase() === "zeyad") {
        setTriggering(true);
        window.setTimeout(() => {
          setTriggering(false);
          navigate({ to: isAdmin ? "/admin" : "/admin/login" });
        }, 1200);
        keys = "";
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isAdmin, navigate]);

  return (
    <>
      <AnimatePresence>
        {triggering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Sparkles className="h-8 w-8" />
              </div>
              <p className="mt-6 font-sans text-sm font-medium tracking-widest text-primary">
                AUTHENTICATING
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="fixed inset-x-0 top-0 z-[100] flex justify-center py-8 pointer-events-none px-4">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card/40 backdrop-blur-xl px-2 py-2 shadow-2xl shadow-black/5 pointer-events-auto ring-1 ring-white/5">
          <Magnetic strength={0.3}>
            <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105">
              <div className="font-display text-lg font-normal leading-none">ZM</div>
            </Link>
          </Magnetic>

          <nav className="hidden items-center gap-1 sm:flex px-2">
            {nav.map((item) => {
              const active = loc.pathname === item.to || (item.to !== "/" && loc.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative rounded-full px-5 py-2 text-[13px] font-medium transition-all ${
                    active ? "bg-foreground text-background shadow-lg" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 ml-1">
            <ModeToggle className="hidden lg:flex" />
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-foreground hover:bg-muted transition-all hover:scale-105"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </motion.div>
              </AnimatePresence>
            </button>
            <button
              onClick={() => setMobileOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-foreground sm:hidden"
              aria-label="Open menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-24 left-4 right-4 rounded-[2rem] border border-border bg-card/90 p-6 backdrop-blur-2xl shadow-2xl pointer-events-auto ring-1 ring-white/5"
            >
              <div className="flex flex-col gap-2">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between rounded-2xl px-6 py-4 text-lg font-medium transition-colors ${
                        loc.pathname === item.to ? "bg-foreground text-background" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {item.label}
                      <ArrowRight className="h-5 w-5 opacity-50" />
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-border flex flex-col gap-6">
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm font-medium text-muted-foreground">App Mode</span>
                  <ModeToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-40 border-t border-border bg-background py-32 lg:py-48">
      <div className="responsive-shell">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-6xl md:text-8xl leading-[0.85] tracking-tight">
              Let's create <br /> something <span className="text-primary italic">impactful</span>.
            </h2>
            <div className="mt-16 flex flex-wrap gap-4">
              <Magnetic strength={0.2}>
                <a href="mailto:contact@zeyad.dev" className="h-14 flex items-center px-8 rounded-full bg-foreground text-background font-medium hover:scale-105 transition-transform shadow-xl shadow-black/10">
                  Get in touch
                </a>
              </Magnetic>
              <Magnetic strength={0.2}>
                <a href="https://github.com/zeyadmohammeds" target="_blank" className="h-14 flex items-center px-8 rounded-full border border-border font-medium hover:bg-muted transition-colors">
                  GitHub
                </a>
              </Magnetic>
            </div>
          </div>

          <div className="flex flex-col gap-10 min-w-[200px]">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Navigation</span>
              <nav className="flex flex-col gap-3">
                {userNav.map((item) => (
                  <Link key={item.to} to={item.to} className="text-lg font-medium hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-40 pt-10 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6 text-[12px] font-medium text-muted-foreground uppercase tracking-widest">
          <p>© {year} Zeyad Mohammed</p>
          <div className="flex items-center gap-6">
            <span>Built with Intention</span>
            <div className="h-1 w-1 rounded-full bg-border" />
            <span>Cairo, EG</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

