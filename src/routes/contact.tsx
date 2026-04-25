import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Github, Linkedin, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - Zeyad Mohammed" },
      { name: "description", content: "Contact form with real backend validation and portfolio inquiries." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("https://zeyadportfolio.runasp.net/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        toast.success("Message sent successfully");
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error();
      }
    } catch {
      setStatus("error");
      toast.error("Failed to send message");
    }
  };

  return (
    <PageShell>
      <div className="pb-32 pt-40 lg:pt-56">
        <section className="responsive-shell">
          <div className="grid gap-24 lg:grid-cols-2 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-8 block">Connect</span>
              <h1 className="font-display text-7xl md:text-9xl leading-[0.85] tracking-tight mb-16">
                Start a <br /> <span className="text-muted-foreground/30 italic">New</span> Chapter.
              </h1>
              
              <div className="space-y-12">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">General Inquiries</span>
                  <a href="mailto:contact@zeyad.dev" className="block text-3xl font-display hover:text-primary transition-colors">contact@zeyad.dev</a>
                </div>
                
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Location</span>
                  <p className="text-3xl font-display">Cairo, Egypt <br /> <span className="text-muted-foreground">GMT +2</span></p>
                </div>

                <div className="flex gap-4 pt-8">
                  <a href="#" className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="#" className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="p-12 lg:p-20 rounded-[4rem] bg-card border border-border shadow-2xl shadow-black/5"
            >
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="space-y-2 border-b border-border pb-4 transition-all focus-within:border-primary">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                  <input
                    required
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    className="w-full bg-transparent border-none p-0 text-xl font-medium focus:ring-0 placeholder:text-muted-foreground/30 outline-none"
                  />
                </div>

                <div className="space-y-2 border-b border-border pb-4 transition-all focus-within:border-primary">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    className="w-full bg-transparent border-none p-0 text-xl font-medium focus:ring-0 placeholder:text-muted-foreground/30 outline-none"
                  />
                </div>

                <div className="space-y-2 border-b border-border pb-4 transition-all focus-within:border-primary">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Message</label>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    placeholder="Tell me about your project"
                    className="w-full bg-transparent border-none p-0 text-xl font-medium focus:ring-0 placeholder:text-muted-foreground/30 resize-none outline-none"
                  />
                </div>

                <button
                  disabled={status === "sending"}
                  type="submit"
                  className="h-16 w-full rounded-full bg-foreground text-background font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                  <ArrowRight className="h-5 w-5" />
                </button>

                {status === "success" && (
                  <p className="text-center text-sm font-bold text-green-500 uppercase tracking-widest animate-pulse">Message sent successfully</p>
                )}
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
