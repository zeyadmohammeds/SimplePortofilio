import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { useApi } from "@/hooks/use-api";
import { useApp } from "@/lib/mode-context";
import { motion } from "framer-motion";
import {
  Activity,
  FolderKanban,
  GraduationCap,
  Mail,
  Zap,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Command,
  Cpu,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function StatCard({ icon: Icon, label, value, delay }: { icon: any; label: string; value: string | number; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-[3rem] border border-border bg-white p-10 transition-all duration-700 hover:border-primary/20 hover:shadow-[0_40px_100px_rgba(0,0,0,0.04)] dark:bg-white/5"
    >
      <div className="flex items-center justify-between mb-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBFBF9] text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500 dark:bg-black/40">
          <Icon className="h-7 w-7" />
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/5 text-success border border-success/10 group-hover:scale-110 transition-transform duration-500">
          <TrendingUp className="h-5 w-5" />
        </div>
      </div>
      <div>
        <div className="text-6xl font-display font-medium tracking-tight text-foreground leading-none group-hover:text-primary transition-colors">{value}</div>
        <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40 mt-6">{label}</div>
      </div>
    </motion.div>
  );
}

function AdminDashboard() {
  const { user, token } = useApp();
  const projects = useApi<any[]>("/api/projects");
  const education = useApi<any[]>("/api/education");
  const messages = useApi<any[]>("/api/contact", [], token);

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-8 py-16">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 space-y-10"
        >
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              System_Nominal // {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </div>
          
          <h1 className="text-8xl md:text-9xl font-display font-medium tracking-tight text-foreground leading-[0.85]">
            Console <br />
            <span className="italic text-muted-foreground/30">Overview.</span>
          </h1>
          
          <p className="text-2xl font-medium text-muted-foreground/60 max-w-2xl italic leading-relaxed">
            Welcome back, {user?.username ?? "Zeyad"}. All core architectural modules are active. Detected {messages.data?.length ?? 0} inbound signals awaiting ingestion.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={FolderKanban} label="Deployed_Nodes" value={projects.data?.length ?? 0} delay={0} />
          <StatCard icon={GraduationCap} label="Knowledge_Base" value={education.data?.length ?? 0} delay={0.1} />
          <StatCard icon={Mail} label="Inbound_Signals" value={messages.data?.length ?? 0} delay={0.2} />
          <StatCard icon={Activity} label="Core_Efficiency" value="98%" delay={0.3} />
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-12">
          {/* Recent Messages */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[4rem] border border-border bg-white lg:col-span-8 overflow-hidden flex flex-col dark:bg-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.03)]"
          >
            <div className="px-12 py-12 flex items-center justify-between border-b border-border/10 bg-muted/5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Signal Buffer</span>
                <h3 className="text-4xl font-display font-medium tracking-tight text-foreground italic">Recent Inbound</h3>
              </div>
              <Link to="/admin/messages" className="pill-button h-12 px-6 gap-3 text-[10px] font-bold uppercase tracking-widest hover:gap-4 transition-all">
                Full Archive <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="flex-1 overflow-auto no-scrollbar">
              {messages.loading ? (
                Array(3).fill(null).map((_, i) => (
                  <div key={i} className="px-12 py-12 space-y-6 border-b border-border/5">
                    <div className="h-8 w-1/4 bg-muted/20 animate-pulse rounded-full" />
                    <div className="h-4 w-full bg-muted/10 animate-pulse rounded-full" />
                  </div>
                ))
              ) : (
                <div className="divide-y divide-border/5">
                  {messages.data?.slice(0, 4).map((m: any) => (
                    <div key={m.id} className="px-12 py-12 flex items-start gap-10 transition-all hover:bg-muted/10 group relative">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-[#FBFBF9] text-foreground font-display font-bold text-2xl border border-border group-hover:scale-110 group-hover:border-primary/30 transition-all duration-700 dark:bg-black/40">
                        {m.name[0]}
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex items-center justify-between mb-4">
                          <div className="font-semibold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">{m.name}</div>
                          <div className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">{new Date(m.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="text-[11px] font-bold text-primary/60 uppercase tracking-widest mb-4">{m.email}</div>
                        <p className="text-lg font-medium text-muted-foreground/60 italic leading-relaxed line-clamp-1 max-w-2xl">{m.message}</p>
                      </div>
                    </div>
                  ))}
                  {messages.data?.length === 0 && (
                    <div className="py-40 text-center text-xs font-bold text-muted-foreground/20 uppercase tracking-[0.5em] italic">
                      // BUFFER_EMPTY_NO_SIGNALS
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Side Module */}
          <div className="lg:col-span-4 space-y-12">
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.5, duration: 1 }}
              className="rounded-[3.5rem] border border-border bg-white p-12 dark:bg-white/5"
            >
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30 mb-10">
                <Command className="h-5 w-5" /> Quick_Access
              </div>
              <div className="space-y-4">
                {[
                  { to: "/admin/projects", label: "Push New Node", icon: FolderKanban, primary: true },
                  { to: "/admin/education", label: "Log Academic Update", icon: GraduationCap },
                  { to: "/dev", label: "System Lab Console", icon: Zap },
                ].map((link) => (
                  <Link 
                    key={link.to}
                    to={link.to} 
                    className={`group flex items-center justify-between h-16 rounded-full px-8 text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:-translate-y-1 ${
                      link.primary 
                        ? "bg-foreground text-background shadow-xl shadow-foreground/10 hover:shadow-2xl" 
                        : "border border-border bg-white text-foreground hover:bg-muted dark:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center gap-5">
                      <link.icon className={`h-5 w-5 ${link.primary ? "" : "text-primary/60"}`} /> 
                      {link.label}
                    </span>
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.6, duration: 1 }}
              className="rounded-[3.5rem] border border-primary/20 bg-primary/5 p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Cpu className="h-32 w-32" />
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-10 relative z-10">
                <Sparkles className="h-5 w-5" /> Diagnostics
              </div>
              <div className="space-y-10 relative z-10">
                {[
                  { label: "Core_Uplink_Load", val: "24.5%" },
                  { label: "Memory_Allocation", val: "68.1%" },
                ].map((stat, i) => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                      <span className="text-muted-foreground/60">{stat.label}</span>
                      <span className="text-primary">{stat.val}</span>
                    </div>
                    <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary" 
                        initial={{ width: 0 }} 
                        animate={{ width: stat.val }} 
                        transition={{ duration: 1.5, delay: 0.8 + i * 0.2, ease: [0.16, 1, 0.3, 1] }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

export default AdminDashboard;
