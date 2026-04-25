import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { SystemArchitecture3D } from "@/components/3d/system-nodes";
import { ArrowRight, Database, Layers3, Lock, Network, Server, Sparkles, Orbit } from "lucide-react";

export const Route = createFileRoute("/dev/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture — Zeyad Mohammed" },
      { name: "description", content: "A visual breakdown of the frontend, backend, and data architecture." },
    ],
  }),
  component: Architecture,
});

function Architecture() {
  return (
    <PageShell>
      <div className="pb-32 selection:bg-primary/20">
        <section className="responsive-shell pt-24 lg:pt-40 pb-16">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.4em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                System Topology
              </div>
              
              <h1 className="font-display text-7xl sm:text-8xl lg:text-9xl tracking-tight leading-[0.85] text-foreground">
                Architectural <span className="italic text-muted-foreground/30">Schema</span>.
              </h1>
              
              <p className="max-w-xl text-2xl leading-relaxed text-muted-foreground italic">
                Mapping the high-fidelity distribution of services, data nodes, and client-side orchestration that powers the ZeyadOS environment.
              </p>
            </motion.div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { icon: Layers3, label: "Core Layer", value: "React 19 + TanStack" },
                { icon: Server, label: "Service Layer", value: ".NET 8 + MediatR" },
                { icon: Database, label: "Persistence", value: "PostgreSQL + EF Core" },
                { icon: Lock, label: "Security", value: "JWT + RBAC" },
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

        {/* 3D Topology View */}
        <section className="responsive-shell pb-24">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[4rem] border border-border bg-white overflow-hidden p-4 dark:bg-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between p-8 border-b border-border/10 bg-muted/5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/20">
                  <Network className="h-6 w-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary leading-none">Live Topology</span>
                  <h3 className="font-display text-3xl leading-none text-foreground">Interactive Nodes</h3>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-border bg-white text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 dark:bg-black/20">
                <Orbit className="h-4 w-4 animate-spin-slow" />
                Input Control Active
              </div>
            </div>
            
            <div className="h-[640px] overflow-hidden rounded-[3rem] bg-[#0A0A0A] relative group">
              {/* Subtle noise texture over the 3D view */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat z-10" />
              
              <Canvas camera={{ position: [0, 2, 10], fov: 40 }} shadows dpr={[1, 2]}>
                <React.Suspense fallback={null}>
                  <SystemArchitecture3D />
                </React.Suspense>
              </Canvas>
              
              <div className="absolute inset-0 pointer-events-none rounded-[3rem] shadow-[inset_0_0_120px_rgba(0,0,0,0.9)] z-20" />
              
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 whitespace-nowrap">
                <div className="h-px w-20 bg-white/10" />
                Distributed Systems Protocol v4.0
                <div className="h-px w-20 bg-white/10" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Insight Cards */}
        <section className="responsive-shell">
          <div className="grid gap-12 lg:grid-cols-3">
            {[
              {
                title: "Frontend Layer",
                body: "A modular React ecosystem utilizing TanStack Router for type-safe orchestration and Framer Motion for high-fidelity interactive feedback.",
              },
              {
                title: "Application Layer",
                body: "Built on .NET 8, the service layer implements a Command Query Responsibility Segregation (CQRS) pattern for predictable data flows.",
              },
              {
                title: "Experience Layer",
                body: "The final synthesis of aesthetics and engineering, where editorial typography meets robust system-level telemetry.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[3rem] border border-border bg-white p-12 group hover:border-primary/20 transition-all dark:bg-white/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary mb-10 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="font-display text-4xl mb-6 text-foreground group-hover:text-primary transition-colors">{item.title}</h2>
                <p className="text-lg leading-relaxed text-muted-foreground italic mb-10">{item.body}</p>
                <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary group-hover:gap-5 transition-all">
                  Registry Detail
                  <ArrowRight className="h-5 w-5" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default Architecture;
