import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { useApi } from "@/hooks/use-api";
import { useApp } from "@/lib/mode-context";
import { fetchJson } from "@/lib/api-client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Trash2,
  CheckCircle2,
  Search,
  Reply,
  Inbox,
  X,
  Filter,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  processed: boolean;
}

export const Route = createFileRoute("/admin/messages")({
  head: () => ({
    meta: [{ title: "Messages — Admin Console" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminMessages,
});

function AdminMessages() {
  const { token } = useApp();
  const { data: contacts, loading, refetch } = useApi<Contact[]>("/api/contact", [], token);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "processed">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = (contacts ?? []).filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.message.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !c.processed) ||
      (filter === "processed" && c.processed);

    return matchesSearch && matchesFilter;
  });

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return;
    try {
      await fetchJson("DELETE", `/api/contact/${id}`, null, token ?? undefined);
      toast.success("Message deleted");
      refetch();
    } catch (err) {
      toast.error("Failed to delete");
    }
  }

  async function toggleProcessed(contact: Contact) {
    try {
      await fetchJson("PATCH", `/api/contact/${contact.id}`, { id: contact.id, processed: !contact.processed }, token ?? undefined);
      toast.success(contact.processed ? "Marked as pending" : "Marked as processed");
      refetch();
    } catch (err) {
      toast.error("Status update failure");
    }
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-5xl px-6 py-12 lg:py-24">
        {/* Header Section */}
        <div className="mb-16 space-y-10">
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Communication Hub
          </div>
          
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="space-y-6">
              <h1 className="font-display text-6xl tracking-tight text-foreground md:text-8xl">
                Signal <span className="italic">Buffer.</span>
              </h1>
              <p className="max-w-md text-xl text-muted-foreground leading-relaxed">
                Management of inbound inquiries and collaboration requests from the public core.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border bg-white/50 p-1.5 backdrop-blur-md dark:bg-black/20">
              {(["all", "pending", "processed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-6 py-2.5 text-xs font-semibold transition-all ${
                    filter === f 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email, or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[2rem] border border-border bg-white/50 py-6 pl-16 pr-8 text-xl outline-none transition-all focus:border-primary/30 focus:ring-4 focus:ring-primary/5 dark:bg-black/20"
            />
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-6">
          {loading ? (
            Array(3).fill(null).map((_, i) => (
              <div key={i} className="h-40 w-full animate-pulse rounded-[3rem] bg-muted/10 border border-border/5" />
            ))
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[3.5rem] border border-dashed border-border bg-muted/5 py-40 text-center">
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-muted/10">
                <Inbox className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <h3 className="font-display text-4xl mb-4">No signals found</h3>
              <p className="text-xl text-muted-foreground">The buffer is currently clear and ready for data.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filtered.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group overflow-hidden rounded-[3rem] border border-border bg-white transition-all duration-500 dark:bg-black/20 ${
                    expandedId === c.id ? "ring-1 ring-primary/20 shadow-2xl shadow-primary/5" : "hover:border-primary/30 hover:shadow-xl hover:shadow-black/5"
                  }`}
                >
                  <div 
                    onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                    className="flex cursor-pointer flex-col gap-8 p-10 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-8">
                      <div className={`flex h-20 w-20 items-center justify-center rounded-[1.5rem] font-display text-3xl transition-all duration-500 ${
                        c.processed 
                          ? "bg-muted/50 text-muted-foreground grayscale" 
                          : "bg-primary/5 text-primary shadow-inner"
                      }`}>
                        {c.name[0]}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <h3 className="text-2xl font-bold tracking-tight text-foreground">{c.name}</h3>
                          {!c.processed && (
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                          <span className="hover:text-primary transition-colors">{c.email}</span>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <span className="flex items-center gap-2">
                             <Calendar className="h-4 w-4 opacity-50" />
                             {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleProcessed(c); }}
                        className={`rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                          c.processed 
                            ? "bg-muted text-muted-foreground" 
                            : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                        }`}
                      >
                        {c.processed ? "Archived" : "Process Signal"}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteMessage(c.id); }}
                        className="rounded-full p-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all hover:rotate-12"
                      >
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === c.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border bg-muted/5"
                      >
                        <div className="p-12 space-y-10">
                          <div className="space-y-6">
                            <div className="flex items-center gap-3">
                              <div className="h-[1px] flex-1 bg-border/50" />
                              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 px-4">Transmission Payload</span>
                              <div className="h-[1px] flex-1 bg-border/50" />
                            </div>
                            <p className="font-serif text-3xl leading-relaxed text-foreground/90 italic p-6">
                              "{c.message}"
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap items-center justify-between gap-6 pt-10 border-t border-border/10">
                            <a 
                              href={`mailto:${c.email}`}
                              className="pill-button h-16 px-10 gap-4 text-sm font-bold uppercase tracking-widest group"
                            >
                              <Reply className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                              Establish Connection
                            </a>
                            <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground/40 bg-muted/20 px-4 py-2 rounded-lg">
                              SYSTEM_UID // {c.id.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

export default AdminMessages;
