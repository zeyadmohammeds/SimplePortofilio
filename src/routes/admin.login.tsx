import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/mode-context";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  ArrowRight,
  Shield,
  User,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { fetchJson } from "@/lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const { setToken } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetchJson<any>("POST", "/api/auth/login", { email, password });
      const token = res?.data?.accessToken ?? res?.token;

      if (!token) throw new Error("Authentication Failed: No token returned");

      setToken(token);
      toast.success("Identity Verified. Access Granted.");
      navigate({ to: "/admin", search: {} as any });
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Access denied.");
      toast.error("Access Denied");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-6 selection:bg-primary/20 selection:text-primary overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] translate-y-1/2 -translate-x-1/2 rounded-full bg-secondary/15 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 blur-2xl opacity-50" />
        
        <div className="relative rounded-[2.5rem] border border-border/10 bg-card/40 p-10 backdrop-blur-3xl shadow-2xl">
          <div className="mb-12 flex flex-col items-center text-center">
            <motion.div 
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5"
            >
              <Shield className="h-10 w-10" />
            </motion.div>
            <h1 className="text-4xl font-display font-medium tracking-tight text-foreground">Terminal Access</h1>
            <p className="mt-4 text-sm font-medium text-muted-foreground/60 uppercase tracking-widest">Identify yourself to proceed</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-[11px] font-bold uppercase tracking-widest text-destructive text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/40 ml-4">Credential_Alpha (Email)</label>
              <div className="group relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-colors group-focus-within:text-primary">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  placeholder="admin@zeyad.me"
                  className="w-full rounded-2xl border border-border/10 bg-muted/30 py-4 pl-16 pr-6 text-sm font-medium outline-none transition-all focus:border-primary/30 focus:bg-muted/50 placeholder:text-muted-foreground/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/40 ml-4">Cipher_Omega (Password)</label>
              <div className="group relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-colors group-focus-within:text-primary">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full rounded-2xl border border-border/10 bg-muted/30 py-4 pl-16 pr-6 text-sm font-medium outline-none transition-all focus:border-primary/30 focus:bg-muted/50 placeholder:text-muted-foreground/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden rounded-2xl bg-foreground py-5 text-[11px] font-bold uppercase tracking-[0.3em] text-background transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-xl"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Zap className="h-4 w-4" />
                    </motion.div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Establish Link
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-12 text-center">
            <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors inline-flex items-center gap-2">
              <ArrowLeft className="h-3 w-3" /> Return to Public Node
            </Link>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6">
          <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
            <div className="h-1 w-1 rounded-full bg-success" /> Encrypted_AES256
          </div>
          <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
            <div className="h-1 w-1 rounded-full bg-primary" /> ZeyadOS_v2.5
          </div>
        </div>
      </motion.div>
    </div>
  );
}
