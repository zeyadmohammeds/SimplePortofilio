import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { useApi } from "@/hooks/use-api";
import { useApp } from "@/lib/mode-context";
import { fetchJson, type Project, type ProjectType } from "@/lib/api-client";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  X,
  Trash2,
  Pencil,
  ImageIcon,
  LayoutGrid,
  ArrowRight,
  Check,
  Loader2,
  AlertTriangle,
  Eye,
  Activity,
  Globe,
  Github,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({
    meta: [{ title: "Projects — Admin Console" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: ProjectsAdmin,
});

const TYPES: ProjectType[] = ["frontend", "backend", "fullstack", "mobile"];

interface DraftProject {
  id?: string;
  name: string;
  tagline: string;
  description: string;
  type: ProjectType;
  stack: string[];
  year: number;
  githubHandle: string;
  liveUrl: string;
  image?: string;
}

function emptyDraft(): DraftProject {
  return { name: "", tagline: "", description: "", type: "fullstack", stack: [], year: new Date().getFullYear(), githubHandle: "", liveUrl: "" };
}

function projectToDraft(p: Project): DraftProject {
  const handle = p.repo?.replace(/^github\.com\/zeyadmohammeds\//i, "").replace(/^github\.com\/[^/]+\//i, "") ?? "";
  return { id: p.id, name: p.name, tagline: p.tagline, description: p.description, type: p.type, stack: p.stack, year: p.year, githubHandle: handle, liveUrl: p.url ?? "", image: p.image };
}

function ProjectsAdmin() {
  const { token } = useApp();
  const { data: projects, loading, refetch } = useApi<Project[]>("/api/projects", [], token);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | ProjectType>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (projects ?? []).filter((p) => {
      const matchesType = filter === "all" || p.type === filter;
      const matchesQ = q === "" || p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q) || p.stack.some((s) => s.toLowerCase().includes(q));
      return matchesType && matchesQ;
    });
  }, [projects, query, filter]);

  function openNew() { setEditing(null); setDrawerOpen(true); }
  function openEdit(p: Project) { setEditing(p); setDrawerOpen(true); }

  async function handleDelete(p: Project) {
    setBusyId(p.id);
    try {
      await fetchJson("DELETE", `/api/admin/projects/${p.id}`, undefined, token ?? undefined);
      toast.success("Project removed from system");
      refetch();
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to purge entry");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-8 py-16">
        {/* Header Section */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
            className="space-y-8"
          >
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
               <Layers className="h-4 w-4" /> Portfolio_Registry
            </div>
            <h1 className="text-7xl md:text-8xl font-display font-medium tracking-tight text-foreground leading-[0.85]">
              Project <br />
              <span className="italic text-muted-foreground/30">Orchestrator.</span>
            </h1>
            <p className="text-xl font-medium text-muted-foreground/60 max-w-xl italic leading-relaxed">
              Managing the architectural evolution of digital nodes. Orchestrate deployment cycles and metadata synchronization.
            </p>
          </motion.div>
          
          <motion.button 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            whileHover={{ scale: 1.02 }}
            whileActive={{ scale: 0.98 }}
            onClick={openNew}
            className="pill-button h-20 px-12 gap-4 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl shadow-primary/10"
          >
            <Plus className="h-6 w-6" /> Initialize New Node
          </motion.button>
        </div>

        {/* Filters & Search */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }} 
          className="flex flex-col md:flex-row items-center gap-8 mb-16"
        >
          <div className="relative w-full md:w-auto md:flex-1 group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 transition-colors group-focus-within:text-primary" />
            <input 
              type="text" 
              placeholder="Query system registry..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-16 rounded-full border border-border bg-white pl-16 pr-8 text-sm font-medium outline-none focus:border-primary/30 transition-all dark:bg-white/5" 
            />
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-full border border-border bg-white/50 backdrop-blur-md dark:bg-white/5">
            {(["all", ...TYPES] as const).map((t) => (
              <button 
                key={t} 
                onClick={() => setFilter(t)}
                className={`h-12 px-8 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filter === t 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted dark:hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Project List */}
        <div className="grid gap-6">
          {loading ? (
            Array(4).fill(null).map((_, i) => (
              <div key={i} className="h-40 w-full rounded-[3rem] bg-muted/20 animate-pulse border border-border/5" />
            ))
          ) : filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="py-48 text-center space-y-6"
            >
              <div className="h-24 w-24 rounded-full bg-muted/5 flex items-center justify-center mx-auto mb-8 border border-border/10">
                 <LayoutGrid className="h-10 w-10 text-muted-foreground/20" />
              </div>
              <p className="text-xs font-bold text-muted-foreground/30 uppercase tracking-[0.5em] italic">No entities detected in current buffer</p>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {filtered.map((p, idx) => (
                <motion.div 
                  key={p.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: idx * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative flex flex-col lg:flex-row items-center gap-10 rounded-[3.5rem] border border-border bg-white p-8 transition-all duration-700 hover:border-primary/20 hover:shadow-[0_40px_100px_rgba(0,0,0,0.04)] dark:bg-white/5"
                >
                  <div className="relative h-48 w-full lg:w-80 shrink-0 overflow-hidden rounded-[2.5rem] bg-[#FBFBF9] dark:bg-black/40">
                    {p.image ? (
                      <img src={p.image} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-muted-foreground/10" />
                      </div>
                    )}
                    <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest text-primary border border-primary/10 shadow-sm dark:bg-black/60">
                      {p.type}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 py-2 space-y-4 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                       <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.3em]">
                        {p.year} // Node_{p.id?.slice(0, 4)}
                       </span>
                    </div>
                    <h3 className="text-4xl font-display font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-lg font-medium text-muted-foreground/60 italic leading-relaxed line-clamp-1 max-w-2xl">{p.tagline}</p>
                    
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
                      {p.stack.slice(0, 5).map((s) => (
                        <span key={s} className="rounded-full border border-border bg-white px-4 py-1.5 text-[9px] font-bold text-muted-foreground/70 uppercase tracking-widest dark:bg-white/5">
                          {s}
                        </span>
                      ))}
                      {p.stack.length > 5 && (
                        <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest flex items-center px-2">+{p.stack.length - 5} More</span>
                      )}
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-3 shrink-0">
                    <button 
                      onClick={() => openEdit(p)} 
                      className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white text-foreground transition-all hover:bg-primary hover:text-white hover:border-primary shadow-sm active:scale-95 dark:bg-white/5"
                    >
                      <Pencil className="h-6 w-6" />
                    </button>
                    <button 
                      onClick={() => setConfirmDelete(p)} 
                      className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white text-foreground transition-all hover:bg-destructive hover:text-white hover:border-destructive shadow-sm active:scale-95 dark:bg-white/5"
                    >
                      <Trash2 className="h-6 w-6" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Side Panel Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <ProjectDrawer project={editing} onClose={() => setDrawerOpen(false)} onSaved={() => { setDrawerOpen(false); refetch(); }} />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[100] grid place-items-center bg-background/20 p-6 backdrop-blur-xl" onClick={() => setConfirmDelete(null)}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl rounded-[4rem] border border-border bg-white p-16 shadow-2xl text-center dark:bg-card"
            >
              <div className="mx-auto mb-10 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-destructive/5 text-destructive border border-destructive/10 shadow-inner">
                <AlertTriangle className="h-12 w-12" />
              </div>
              <h3 className="text-4xl font-display font-medium tracking-tight text-foreground italic mb-6">Confirm Purge?</h3>
              <p className="text-lg font-medium text-muted-foreground/60 leading-relaxed max-w-sm mx-auto mb-12">
                Removing <span className="text-foreground font-semibold">"{confirmDelete.name}"</span> is a final destructive command. This entity will be scrubbed from the global registry.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setConfirmDelete(null)} className="h-16 flex-1 rounded-full border border-border bg-muted/50 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground transition-all hover:bg-muted active:scale-95">Abort_Op</button>
                <button onClick={() => handleDelete(confirmDelete)} className="h-16 flex-1 rounded-full bg-destructive text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:opacity-90 shadow-xl shadow-destructive/20 active:scale-95">
                  {busyId === confirmDelete.id ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Confirm_Purge"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}

function ProjectDrawer({ project, onClose, onSaved }: { project: Project | null; onClose: () => void; onSaved: () => void }) {
  const { token } = useApp();
  const [draft, setDraft] = useState<DraftProject>(() => project ? projectToDraft(project) : emptyDraft());
  const [stackInput, setStackInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        id: project?.id, name: draft.name, tagline: draft.tagline, description: draft.description, type: draft.type, stack: draft.stack, year: Number(draft.year),
        url: draft.liveUrl, repoName: draft.githubHandle, metricsJson: "{}", imageUrl: draft.image
      };
      await fetchJson("POST", "/api/admin/projects", payload, token ?? undefined);
      toast.success(project ? "Metadata Synchronized" : "Node Initialized");
      onSaved();
    } catch (err: any) {
      if (err.details) setErrors(err.details);
      toast.error(err.message || "Transmission Failure");
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/20 backdrop-blur-sm" onClick={onClose}>
      <motion.aside 
        initial={{ x: "100%" }} 
        animate={{ x: 0 }} 
        exit={{ x: "100%" }} 
        transition={{ type: "spring", damping: 35, stiffness: 250 }}
        onClick={(e) => e.stopPropagation()} 
        className="flex h-full w-full max-w-6xl flex-col border-l border-border bg-[#FBFBF9] shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:bg-card"
      >
        <div className="flex items-center justify-between border-b border-border bg-white px-12 py-12 dark:bg-white/5">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary block">{project ? "Update_Protocol" : "Initialize_Registry"}</span>
            <h2 className="text-4xl font-display font-medium tracking-tight text-foreground">{project ? "Edit Configuration" : "New System Node"}</h2>
          </div>
          <button onClick={onClose} className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-white hover:bg-muted transition-all active:scale-95 dark:bg-white/5">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Form Side */}
          <div className="lg:col-span-7 overflow-y-auto p-12 space-y-12 no-scrollbar">
            <div className="space-y-10">
              <Field label="System Designation" error={errors.name}>
                <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} className="mehaxan-input" placeholder="e.g. ZeyadOS Terminal" />
              </Field>
              
              <Field label="Architectural Tagline" error={errors.tagline}>
                <input value={draft.tagline} onChange={e => setDraft(d => ({ ...d, tagline: e.target.value }))} className="mehaxan-input" placeholder="Primary objective..." />
              </Field>
              
              <Field label="Technical Log / Description" error={errors.description}>
                <textarea value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} rows={6} className="mehaxan-input py-6 resize-none" placeholder="Detailed structural analysis..." />
              </Field>
              
              <div className="grid grid-cols-2 gap-8">
                <Field label="Service Class">
                  <select value={draft.type} onChange={e => setDraft(d => ({ ...d, type: e.target.value as any }))} className="mehaxan-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_1.5rem_center] bg-no-repeat">
                    {TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                  </select>
                </Field>
                <Field label="Deployment Epoch">
                  <input type="number" value={draft.year} onChange={e => setDraft(d => ({ ...d, year: Number(e.target.value) }))} className="mehaxan-input" />
                </Field>
              </div>

              <Field label="Technological Stack" hint="Enter to commit">
                <div className="flex flex-wrap gap-2 mb-6">
                  {draft.stack.map(s => (
                    <span key={s} className="flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                      {s} <button onClick={() => setDraft(d => ({ ...d, stack: d.stack.filter(x => x !== s) }))} className="hover:text-foreground"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
                <input 
                  value={stackInput} 
                  onChange={e => setStackInput(e.target.value)} 
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (stackInput.trim()) { setDraft(d => ({ ...d, stack: [...d.stack, stackInput.trim()] })); setStackInput(""); } } }}
                  className="mehaxan-input" 
                  placeholder="Append new module..." 
                />
              </Field>

              <Field label="Primary Asset URI">
                 <div className="flex gap-6 items-end">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-border bg-white overflow-hidden shadow-inner dark:bg-white/5">
                      {draft.image ? <img src={draft.image} className="h-full w-full object-cover" /> : <ImageIcon className="h-6 w-6 text-muted-foreground/10" />}
                    </div>
                    <input value={draft.image} onChange={e => setDraft(d => ({ ...d, image: e.target.value }))} className="flex-1 mehaxan-input" placeholder="https://cdn.io/asset.jpg" />
                 </div>
              </Field>

              <div className="grid grid-cols-2 gap-8">
                <Field label="Source Control Handle">
                  <div className="relative group">
                    <Github className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30" />
                    <input value={draft.githubHandle} onChange={e => setDraft(d => ({ ...d, githubHandle: e.target.value }))} className="mehaxan-input pl-16" placeholder="Repo_Slug" />
                  </div>
                </Field>
                <Field label="Live Production Link">
                  <div className="relative group">
                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30" />
                    <input value={draft.liveUrl} onChange={e => setDraft(d => ({ ...d, liveUrl: e.target.value }))} className="mehaxan-input pl-16" placeholder="https://domain.io" />
                  </div>
                </Field>
              </div>
            </div>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-5 hidden lg:flex flex-col bg-muted/20 p-16 overflow-y-auto no-scrollbar border-l border-border dark:bg-black/20">
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground/40 mb-12">
               <Eye className="h-5 w-5" /> Visual_Projection
            </div>
            
            <div className="rounded-[4rem] border border-border bg-white p-12 shadow-[0_60px_120px_rgba(0,0,0,0.06)] dark:bg-card">
              <div className="aspect-[4/3] w-full rounded-[2.5rem] bg-[#FBFBF9] overflow-hidden border border-border mb-10 shadow-inner dark:bg-black/40">
                {draft.image ? <img src={draft.image} className="h-full w-full object-cover grayscale" /> : <div className="h-full w-full flex items-center justify-center opacity-5"><Activity className="h-20 w-20 animate-pulse" /></div>}
              </div>
              <div className="flex items-center justify-between mb-6">
                 <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">{draft.type} // SYSTEM</span>
                 <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.3em]">{draft.year}</span>
              </div>
              <h3 className="text-4xl font-display font-medium tracking-tight text-foreground leading-[0.9] mb-6 italic">{draft.name || "UNNAMED_ENTITY"}</h3>
              <p className="text-xl font-medium text-muted-foreground/50 leading-relaxed italic line-clamp-3">{draft.tagline || "Telemetry signal pending..."}</p>
              
              <div className="mt-12 flex flex-wrap gap-2 opacity-30">
                {draft.stack.map(s => <span key={s} className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">#{s}</span>)}
              </div>
            </div>
            
            <div className="mt-auto pt-12">
              <div className="rounded-3xl border border-border bg-white/50 p-8 flex items-center gap-5 backdrop-blur-md dark:bg-white/5">
                <div className="h-2.5 w-2.5 rounded-full bg-success animate-pulse shadow-[0_0_15px_rgba(0,255,0,0.5)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">Local_Registry_Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border px-12 py-12 flex items-center justify-between bg-white dark:bg-white/5">
           <button onClick={onClose} className="text-[11px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40 hover:text-foreground transition-colors">Abort_Draft</button>
           <button 
             onClick={onSubmit} 
             disabled={saving} 
             className="pill-button h-20 px-16 gap-4 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl shadow-primary/10 disabled:opacity-30"
           >
             {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Check className="h-6 w-6" /> Push to Production</>}
           </button>
        </div>
      </motion.aside>

      <style>{`
        .mehaxan-input { 
          width: 100%; 
          border-radius: 1.5rem;
          border: 1px solid rgba(var(--border-rgb), 0.5); 
          background: #FFF; 
          padding: 1.5rem 1.75rem; 
          font-size: 1rem; 
          font-weight: 500; 
          font-style: italic;
          outline: none; 
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        :is(.dark .mehaxan-input) {
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.1);
        }
        .mehaxan-input:focus { 
          border-color: var(--primary); 
          background: #FFF; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.03);
          transform: translateY(-2px);
        }
        :is(.dark .mehaxan-input:focus) {
          background: rgba(255,255,255,0.05);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/30">{label}</label>
        {hint && <span className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">{hint}</span>}
      </div>
      {children}
      {error && (
        <motion.p 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="text-[10px] font-bold uppercase tracking-widest text-destructive px-4 py-2 bg-destructive/5 rounded-full inline-block"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

export default ProjectsAdmin;
