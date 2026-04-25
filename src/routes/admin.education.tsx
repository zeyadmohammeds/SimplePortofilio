import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { useApi } from "@/hooks/use-api";
import { useApp } from "@/lib/mode-context";
import { fetchJson, type Education } from "@/lib/api-client";
import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Trash2,
  Pencil,
  Loader2,
  AlertTriangle,
  Check,
  GraduationCap,
  Calendar,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/education")({
  head: () => ({
    meta: [
      { title: "Education — Admin Console" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EducationAdmin,
});

interface DraftEdu {
  id?: string;
  school: string;
  degree: string;
  focus: string;
  years: string;
  notes: string;
}

function emptyDraft(): DraftEdu {
  return { school: "", degree: "", focus: "", years: "", notes: "" };
}

function eduToDraft(e: Education): DraftEdu {
  return {
    id: e.id,
    school: e.school,
    degree: e.degree,
    focus: e.focus ?? "",
    years: e.years,
    notes: e.notes ?? "",
  };
}

function EducationAdmin() {
  const { token } = useApp();
  const { data, loading, refetch } = useApi<Education[]>("/api/education", [], token);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Education | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  function openNew() { setEditing(null); setDrawerOpen(true); }
  function openEdit(e: Education) { setEditing(e); setDrawerOpen(true); }

  async function handleDelete(e: Education) {
    if (!e.id) return;
    setBusy(e.id);
    try {
      await fetchJson("DELETE", `/api/admin/education/${e.id}`, undefined, token ?? undefined);
      toast.success("Entry removed from registry");
      refetch();
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to decommission entry");
    } finally {
      setBusy(null);
    }
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-24">
        {/* Header Section */}
        <div className="mb-20 space-y-10">
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Curriculum Vitae
          </div>
          
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="space-y-6">
              <h1 className="font-display text-6xl tracking-tight text-foreground md:text-8xl">
                Academic <span className="italic">History.</span>
              </h1>
              <p className="max-w-md text-xl text-muted-foreground leading-relaxed">
                Documenting the architectural foundations and technical growth of the core system.
              </p>
            </div>

            <button 
              onClick={openNew}
              className="pill-button h-16 px-10 gap-4 text-sm font-bold uppercase tracking-widest shadow-2xl shadow-primary/20"
            >
              <Plus className="h-6 w-6" />
              Register Milestone
            </button>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-4">
          {loading ? (
            Array(3).fill(null).map((_, i) => (
              <div key={i} className="h-32 w-full animate-pulse rounded-[2.5rem] bg-muted/10 border border-border/5" />
            ))
          ) : (data ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[3.5rem] border border-dashed border-border bg-muted/5 py-40 text-center">
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-muted/10">
                <GraduationCap className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <h3 className="font-display text-4xl mb-4 text-foreground">No records found</h3>
              <p className="text-xl text-muted-foreground">The academic registry is currently empty.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {(data ?? []).map((e) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative overflow-hidden rounded-[3rem] border border-border bg-white p-10 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-black/5 dark:bg-black/20"
                >
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-10">
                      <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-primary/5 text-primary shadow-inner group-hover:scale-105 transition-transform duration-500">
                        <GraduationCap className="h-10 w-10" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-3xl font-bold tracking-tight text-foreground">{e.degree}</h3>
                        <div className="flex flex-wrap items-center gap-6 text-base font-medium text-muted-foreground">
                          <span className="text-foreground/80">{e.school}</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-border" />
                          <span className="flex items-center gap-2">
                             <Calendar className="h-5 w-5 opacity-50 text-primary" />
                             {e.years}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <button 
                        onClick={() => openEdit(e)}
                        className="rounded-full bg-muted/50 p-5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300"
                      >
                        <Pencil className="h-7 w-7" />
                      </button>
                      <button 
                        onClick={() => setConfirmDelete(e)}
                        className="rounded-full bg-muted/50 p-5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
                      >
                        <Trash2 className="h-7 w-7" />
                      </button>
                    </div>
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
          <EducationDrawer 
            entry={editing} 
            onClose={() => setDrawerOpen(false)} 
            onSaved={() => { setDrawerOpen(false); refetch(); }} 
          />
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[100] grid place-items-center bg-background/60 p-6 backdrop-blur-xl" onClick={() => setConfirmDelete(null)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-[3.5rem] border border-border bg-white p-16 shadow-2xl dark:bg-[#0F0F0F]"
            >
              <div className="mx-auto mb-10 flex h-28 w-28 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-14 w-14" />
              </div>
              <h3 className="text-center font-display text-5xl mb-6">Decommission?</h3>
              <p className="text-center text-xl text-muted-foreground leading-relaxed">
                Removing <span className="text-foreground font-bold underline decoration-primary/30 underline-offset-8">{confirmDelete.degree}</span> will permanently purge this record.
              </p>
              <div className="mt-16 grid grid-cols-2 gap-8">
                <button 
                  onClick={() => setConfirmDelete(null)} 
                  className="rounded-full border border-border py-5 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted/50 transition-all"
                >
                  Abort
                </button>
                <button 
                  onClick={() => handleDelete(confirmDelete)} 
                  className="rounded-full bg-destructive py-5 text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-destructive/20 hover:scale-105 active:scale-95 transition-all"
                >
                  {busy === confirmDelete.id ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : "Confirm Purge"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}

function EducationDrawer({ entry, onClose, onSaved }: { entry: Education | null; onClose: () => void; onSaved: () => void }) {
  const { token } = useApp();
  const [draft, setDraft] = useState<DraftEdu>(() => (entry ? eduToDraft(entry) : emptyDraft()));
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
      const [startYear, endYear] = draft.years.split(/[—-]/).map(p => p.trim()).filter(Boolean);
      const payload = {
        id: entry?.id, school: draft.school, degree: draft.degree, focus: draft.focus,
        startDate: `${startYear || "2010"}-01-01`, endDate: `${endYear || startYear || "2010"}-12-31`, notes: draft.notes
      };
      await fetchJson("POST", "/api/admin/education", payload, token ?? undefined);
      toast.success("Synchronized successfully");
      onSaved();
    } catch (err: any) {
      if (err.details) setErrors(err.details);
      toast.error(err.message || "Failed to update registry");
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur-xl" onClick={onClose}>
      <motion.aside 
        initial={{ x: "100%" }} 
        animate={{ x: 0 }} 
        exit={{ x: "100%" }} 
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()} 
        className="flex h-full w-full max-w-4xl flex-col border-l border-border bg-white shadow-pop dark:bg-[#0A0A0A]"
      >
        <div className="flex items-center justify-between border-b border-border p-12">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">{entry ? "// Registry Update" : "// Initialize Node"}</span>
            <h2 className="font-display text-5xl tracking-tight text-foreground">{entry ? "Edit Milestone" : "Register Node"}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background hover:bg-muted/50 transition-all duration-300"
          >
            <X className="h-8 w-8" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-16 space-y-16 no-scrollbar">
          <Field label="Academic Institution" error={errors.school}>
            <input 
              value={draft.school} 
              onChange={e => setDraft(d => ({ ...d, school: e.target.value }))} 
              className="premium-input" 
              placeholder="Designate institution..." 
            />
          </Field>
          
          <Field label="Qualification Title" error={errors.degree}>
            <input 
              value={draft.degree} 
              onChange={e => setDraft(d => ({ ...d, degree: e.target.value }))} 
              className="premium-input text-3xl font-display italic" 
              placeholder="Identify degree level..." 
            />
          </Field>
          
          <div className="grid grid-cols-2 gap-12">
             <Field label="Specialization">
               <input value={draft.focus} onChange={e => setDraft(d => ({ ...d, focus: e.target.value }))} className="premium-input" placeholder="Primary focus..." />
             </Field>
             <Field label="Operational Timeline" error={errors.years}>
               <input value={draft.years} onChange={e => setDraft(d => ({ ...d, years: e.target.value }))} className="premium-input" placeholder="2018 - 2022" />
             </Field>
          </div>
          
          <Field label="Additional Insights">
            <textarea value={draft.notes} onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))} rows={5} className="premium-input py-6 resize-none leading-relaxed" placeholder="Supplementary data..." />
          </Field>

          {/* Live Preview Card */}
          <div className="pt-12">
            <div className="rounded-[3.5rem] border border-border bg-muted/5 p-12 space-y-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <GraduationCap className="h-32 w-32" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40 flex items-center gap-3">
                <Eye className="h-5 w-5" /> Live Registry Preview
              </span>
              <div className="space-y-6 relative z-10">
                <h3 className="font-display text-4xl text-foreground leading-tight">{draft.degree || "Degree Title"}</h3>
                <p className="text-2xl text-muted-foreground/80">{draft.school || "Institution Name"}</p>
                <div className="flex items-center gap-4 text-base font-bold text-primary/60">
                  <Calendar className="h-5 w-5" />
                  {draft.years || "YYYY - YYYY"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border p-12 flex items-center justify-between bg-muted/5">
           <button onClick={onClose} className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors">Discard Draft</button>
           <button onClick={onSubmit} disabled={saving} className="pill-button h-20 px-16 gap-6 text-sm font-bold uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105">
             {saving ? <Loader2 className="h-7 w-7 animate-spin" /> : <><Check className="h-7 w-7" /> Commit to Registry</>}
           </button>
        </div>

        <style>{`
          .premium-input { 
            width: 100%; 
            border-bottom: 2px solid var(--border); 
            background: transparent; 
            padding: 1.5rem 0; 
            font-size: 1.25rem; 
            font-weight: 500; 
            outline: none; 
            transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1); 
          }
          .premium-input:focus { 
            border-bottom-color: var(--primary); 
            padding-left: 0.5rem;
          }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </motion.aside>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50">{label}</label>
      {children}
      {error && <p className="text-sm font-bold text-destructive animate-pulse">{error}</p>}
    </div>
  );
}

export default EducationAdmin;
