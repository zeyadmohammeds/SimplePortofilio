import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/mode-context";
import {
  LayoutDashboard,
  FolderKanban,
  GraduationCap,
  LogOut,
  ArrowLeft,
  Mail,
  Menu,
  X,
  Command,
  ArrowUpRight,
} from "lucide-react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban, exact: false },
  { to: "/admin/education", label: "Education", icon: GraduationCap, exact: false },
  { to: "/admin/messages", label: "Messages", icon: Mail, exact: false },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, logout } = useApp();
  const loc = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate({ to: "/admin/login", search: {} as any });
  }

  useEffect(() => {
    setMobileOpen(false);
  }, [loc.pathname]);

  return (
    <div className="flex min-h-screen bg-[#FBFBF9] text-[#1A1A1A] font-sans selection:bg-primary/10 dark:bg-[#0A0A0A] dark:text-[#E5E5E5]">
      {/* Sidebar - Desktop */}
      <aside className="sticky top-0 hidden h-screen w-80 shrink-0 flex-col border-r border-border/5 bg-white/50 backdrop-blur-3xl dark:bg-black/20 md:flex">
        <div className="flex items-center gap-4 px-10 py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/20">
            <Command className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl tracking-tight leading-none italic">ZeyadOS</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 mt-1">Console</span>
          </div>
        </div>

        <nav className="flex-1 px-6 py-6 space-y-12">
          <div>
            <span className="px-4 text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30">Registry</span>
            <ul className="mt-6 space-y-2">
              {NAV.map((n) => {
                const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
                return (
                  <li key={n.to}>
                    <Link to={n.to}
                      className={`group flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all duration-500 ${
                        active 
                          ? "bg-white text-primary shadow-2xl shadow-black/5 dark:bg-white/5" 
                          : "text-muted-foreground hover:bg-white/50 hover:text-foreground dark:hover:bg-white/5"
                      }`}>
                      <div className="flex items-center gap-4">
                        <n.icon className={`h-5 w-5 transition-colors duration-500 ${active ? "text-primary" : "text-muted-foreground/40 group-hover:text-foreground"}`} />
                        <span className="text-sm font-semibold tracking-tight">{n.label}</span>
                      </div>
                      {active && (
                        <motion.div layoutId="nav-active" className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,77,0,0.5)]" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <span className="px-4 text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30">System</span>
            <ul className="mt-6 space-y-2">
              <li>
                <Link to="/"
                  className="group flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-sm font-semibold text-muted-foreground transition-all hover:bg-white/50 hover:text-foreground dark:hover:bg-white/5">
                  <ArrowLeft className="h-5 w-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                  <span>Public Core</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="p-6">
          <div className="rounded-[2.5rem] border border-border/5 bg-white/80 p-6 shadow-2xl shadow-black/5 dark:bg-white/5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted font-display text-xl font-bold border border-border/10">
                {user?.username?.[0] ?? "A"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold tracking-tight">{user?.username ?? "Admin"}</div>
                <div className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Root Access</div>
              </div>
              <button onClick={handleLogout} 
                className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-24 items-center justify-between px-10 bg-[#FBFBF9]/80 backdrop-blur-xl dark:bg-[#0A0A0A]/80 md:bg-transparent">
          <div className="flex items-center gap-8">
            <button onClick={() => setMobileOpen(true)} 
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-white md:hidden dark:bg-white/5">
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:block"><Crumbs /></div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 rounded-full border border-border bg-white/50 px-5 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest backdrop-blur-md dark:bg-white/5">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Node_Healthy
             </div>
          </div>
        </header>

        <motion.main 
          key={loc.pathname} 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 overflow-x-hidden"
        >
          {children}
        </motion.main>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-xl md:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-[110] w-[85vw] bg-white p-10 dark:bg-[#0A0A0A] overflow-y-auto">
              <div className="flex items-center justify-between mb-16">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white"><Command className="h-6 w-6" /></div>
                  <span className="font-display text-3xl italic">ZeyadOS</span>
                </div>
                <button onClick={() => setMobileOpen(false)} 
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border"><X className="h-6 w-6" /></button>
              </div>
              <nav className="space-y-12">
                 <div className="space-y-4">
                   <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30 px-2">Management</span>
                   <div className="grid gap-2">
                     {NAV.map((n) => {
                       const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
                       return (
                         <Link key={n.to} to={n.to}
                           className={`flex items-center justify-between px-8 py-6 rounded-[2rem] text-lg font-semibold transition-all ${
                             active ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-muted-foreground bg-muted/5"
                           }`}>
                           <div className="flex items-center gap-6">
                             <n.icon className="h-6 w-6" /> {n.label}
                           </div>
                           {active && <ArrowUpRight className="h-6 w-6" />}
                         </Link>
                       );
                     })}
                   </div>
                 </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Crumbs() {
  const loc = useLocation();
  const segments = loc.pathname.split("/").filter(Boolean);
  return (
    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">
      {segments.map((s, i) => (
        <span key={i} className="flex items-center gap-4">
          {i > 0 && <span className="text-border">/</span>}
          <span className={i === segments.length - 1 ? "text-foreground font-black tracking-[0.4em]" : ""}>{s}</span>
        </span>
      ))}
    </div>
  );
}
