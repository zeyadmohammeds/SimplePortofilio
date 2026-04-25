import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { JsonView } from "@/components/json-view";
import { useApp } from "@/lib/mode-context";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  FileWarning,
  ImageIcon,
  Loader2,
  UploadCloud,
  X,
  Server,
  Braces,
  Cpu,
  Fingerprint,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dev/upload")({
  head: () => ({
    meta: [
      { title: "Upload Lab — Terminal" },
      { name: "description", content: "Advanced upload sequence with real-time validation and response telemetry." },
    ],
  }),
  component: UploadDemo,
});

const maxBytes = 5 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function UploadDemo() {
  const { token } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [response, setResponse] = useState<{ status: number; statusText: string; ms: number; body: unknown } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  function setPickedFile(nextFile: File | null) {
    setValidationError(null);
    setResponse(null);

    if (!nextFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    if (!nextFile.type.startsWith("image/")) {
      setValidationError(`UNSUPPORTED_MIME: ${nextFile.type || "unknown"}`);
      return;
    }

    if (nextFile.size > maxBytes) {
      setValidationError(`OVERSIZED_PAYLOAD: ${formatBytes(nextFile.size)} > 5MB`);
      return;
    }

    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    setPickedFile(event.target.files?.[0] ?? null);
  }

  function handleDrag(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setPickedFile(e.dataTransfer.files[0]);
    }
  }

  async function upload() {
    if (!file) return;
    setUploading(true);
    setResponse(null);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const started = performance.now();
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "https://zeyadportfolio.runasp.net";
      
      const response = await fetch(`${apiBaseUrl}/api/v1/admin/upload`, {
        method: "POST",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
        body: formData,
      });

      const text = await response.text();
      let body: unknown = text;
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        body = text;
      }

      setResponse({
        status: response.status,
        statusText: response.statusText,
        ms: Math.round(performance.now() - started),
        body,
      });
      
      if (response.ok) {
        toast.success("Synchronized successfully");
      }
    } catch (error) {
      setResponse({
        status: 0,
        statusText: "UPLINK_FAILURE",
        ms: 0,
        body: (error as Error).message,
      });
      toast.error("Network disruption detected");
    } finally {
      setUploading(false);
    }
  }

  function clearFile() {
    setFile(null);
    setPreview(null);
    setResponse(null);
    setValidationError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <PageShell>
      <div className="pb-32 selection:bg-primary/20">
        <section className="responsive-shell pt-24 lg:pt-40 pb-16">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.4em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Upload Laboratory
              </div>
              
              <h1 className="font-display text-7xl sm:text-8xl lg:text-9xl tracking-tight leading-[0.85] text-foreground">
                Data <span className="italic text-muted-foreground/30">Ingestion</span> Protocol.
              </h1>
              
              <p className="max-w-xl text-2xl leading-relaxed text-muted-foreground italic">
                Validating structural integrity and mime-type signatures in real-time. Experience the friction-less transition from local binary to cloud asset.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { value: "5.0MB", label: "Payload Limit", icon: Server },
                { value: "RFC 7519", label: "Protocol", icon: Cpu },
                { value: "Immutable", label: "Storage", icon: Fingerprint },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                  className="rounded-[2.5rem] border border-border bg-white p-8 flex items-center justify-between group hover:border-primary/20 transition-all dark:bg-white/5"
                >
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                      {item.label}
                    </div>
                    <div className="text-xl font-bold tracking-tight text-foreground">{item.value}</div>
                  </div>
                  <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-all">
                    <item.icon className="h-5 w-5" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="responsive-shell">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
            
            {/* Upload Zone */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[4rem] border border-border bg-white p-10 flex flex-col dark:bg-white/5 shadow-2xl shadow-black/5"
            >
              <label 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`block flex-1 group cursor-pointer transition-all duration-500 ${isDragging ? 'scale-[0.99]' : ''}`}
              >
                <div className={`flex h-[36rem] flex-col items-center justify-center rounded-[3rem] border-2 border-dashed transition-all duration-700 p-8 text-center relative overflow-hidden dark:bg-black/40 ${
                  isDragging 
                    ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                    : "border-border/50 bg-[#FBFBF9] group-hover:bg-white group-hover:border-primary/30"
                }`}>
                  <AnimatePresence mode="wait">
                    {preview ? (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full h-full flex flex-col items-center justify-center"
                      >
                        <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:bg-black">
                          <img src={preview} alt="Payload preview" className="h-[24rem] w-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              clearFile();
                            }}
                            className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-md hover:bg-destructive hover:text-white transition-all shadow-xl"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                        <div className="mt-10 font-display text-2xl italic tracking-tight text-foreground">{file?.name}</div>
                        <div className="mt-3 flex items-center gap-3 rounded-full border border-border px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-white dark:bg-white/5">
                          {formatBytes(file?.size ?? 0)} // {file?.type.split('/')[1].toUpperCase()}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center"
                      >
                        <div className="flex h-28 w-28 items-center justify-center rounded-[2.5rem] bg-primary/5 text-primary mb-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                          <UploadCloud className="h-12 w-12" />
                        </div>
                        <h2 className="font-display text-4xl mb-6 text-foreground">Initiate Transfer</h2>
                        <p className="max-w-[320px] text-lg leading-relaxed text-muted-foreground font-medium italic">
                          Drop binary assets or click to browse the local file system.
                        </p>
                        <div className="mt-10 pill-button h-16 px-10 gap-3 font-bold uppercase tracking-widest text-xs pointer-events-none group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all">
                          Browse Local Storage
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <input ref={inputRef} type="file" accept="image/*" onChange={onInputChange} className="hidden" />
              </label>

              <AnimatePresence>
                {validationError && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: 10, height: 0 }}
                    className="mt-8 rounded-3xl border border-destructive/20 bg-destructive/5 px-8 py-6 text-sm font-bold text-destructive"
                  >
                    <div className="flex items-center gap-4">
                      <FileWarning className="h-6 w-6 shrink-0" />
                      <span className="tracking-widest uppercase">{validationError}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={upload}
                disabled={!file || uploading || !!validationError}
                className="mt-10 pill-button h-20 w-full text-sm font-bold uppercase tracking-[0.2em] shadow-2xl shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale transition-all"
              >
                {uploading ? (
                  <><Loader2 className="h-6 w-6 mr-4 animate-spin" /> Synchronizing...</>
                ) : (
                  <><Braces className="h-6 w-6 mr-4" /> Commit to Node</>
                )}
              </button>
            </motion.div>

            {/* Response Section */}
            <div className="space-y-12">
               <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="rounded-[3.5rem] border border-border bg-white p-12 dark:bg-white/5"
              >
                <div className="flex items-center justify-between mb-10">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Transmission Payload</span>
                    <h2 className="font-display text-4xl tracking-tight leading-none italic text-foreground">Server Ledger</h2>
                  </div>
                  {response && (
                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        response.status >= 400 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                      }`}>
                        STATUS_{response.status}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="relative min-h-[30rem] rounded-[2.5rem] bg-[#0A0A0A] p-8 overflow-hidden shadow-2xl dark">
                  {/* Subtle noise texture */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
                  
                  {response ? (
                    <div className="relative z-10 h-full overflow-auto custom-scrollbar">
                       <JsonView data={response.body} />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                      <div className="h-20 w-20 rounded-full border border-white/10 flex items-center justify-center">
                         <Loader2 className="h-8 w-8 text-white animate-pulse" />
                      </div>
                      <p className="max-w-[240px] text-xs font-bold uppercase tracking-[0.2em] text-white">Awaiting Connection...</p>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="rounded-[2.5rem] border border-border bg-white/50 p-10 dark:bg-white/5"
              >
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40 mb-8">
                  <CheckCircle2 className="h-4 w-4" />
                  Validation Rules
                </div>
                <div className="space-y-6">
                  {[
                    "Mime-type signature verification prior to uplink.",
                    "Payload dimension check against 5MB threshold.",
                    "Real-time telemetry of server-side JSON response.",
                  ].map((note, i) => (
                    <div key={i} className="flex items-start gap-4">
                       <span className="text-primary font-bold">0{i+1}</span>
                       <p className="text-base font-medium text-muted-foreground italic leading-relaxed">{note}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default UploadDemo;
