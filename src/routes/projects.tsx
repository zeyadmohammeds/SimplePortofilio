import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SideScrollIndicator } from "@/components/ui/side-scroll-indicator";
import { useApi } from "@/hooks/use-api";
import { motion, AnimatePresence } from "framer-motion";
import {
  AppWindow,
  ArrowUpRight,
  Database,
  ExternalLink,
  Layers3,
  LayoutGrid,
  Smartphone,
  X,
  Globe,
  Filter,
  ChevronRight,
  ArrowRight,
  Github,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects - Zeyad Mohammed" },
      {
        name: "description",
        content: "Selected projects across frontend, backend, and full-stack product work.",
      },
    ],
  }),
  component: Projects,
});

interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  type: string | number;
  stack: string[];
  metrics: Record<string, number>;
  year: number;
  repo: string;
  url?: string;
  image?: string;
  images?: string[];
}

const filters = [
  { id: "all", label: "All Works", icon: LayoutGrid },
  { id: "fullstack", label: "Systems", icon: Layers3 },
  { id: "frontend", label: "Interfaces", icon: AppWindow },
  { id: "backend", label: "Engines", icon: Database },
  { id: "mobile", label: "Mobile", icon: Smartphone },
] as const;

function getTypeLabel(type: string | number) {
  if (typeof type === "number") {
    return ["frontend", "backend", "fullstack", "mobile"][type] ?? "fullstack";
  }
  return type?.toString().toLowerCase() || "fullstack";
}

function Projects() {
  const { data, loading } = useApi<Project[]>("/api/projects");
  const [filter, setFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data;
    return data.filter((project) => getTypeLabel(project.type) === filter);
  }, [data, filter]);

  // Mouse tracking for project preview
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-300, 300], [10, -10]);
  const rotateY = useTransform(smoothX, [-300, 300], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <PageShell>
      <SideScrollIndicator />
      <div className="pb-24 sm:pb-32 pt-28 sm:pt-40 lg:pt-56">
        {/* HEADER SECTION */}
        <section className="responsive-shell mb-32">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-8"
            >
              Selected Archives
            </motion.div>
            
            <motion.h1
              className="font-display text-6xl sm:text-7xl md:text-9xl tracking-tight leading-[0.85] text-foreground mb-10 sm:mb-12 overflow-hidden"
            >
              {"Building".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
              <br />
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                Digital
              </motion.span>
              <span className="inline-block w-4 md:w-8" />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1.5 }}
                className="text-muted-foreground/30 italic"
              >
                Landscapes.
              </motion.span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-2"
            >
              {filters.map((item) => {
                const active = filter === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setFilter(item.id)}
                    className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                      active
                        ? "bg-foreground text-background shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* PROJECTS LIST */}
        <section className="responsive-shell">
          <div className="flex flex-col">
            {loading &&
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-40 w-full mb-12 rounded-3xl bg-muted animate-pulse" />
              ))}

            <AnimatePresence mode="popLayout">
              {!loading &&
                filtered.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="group relative"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between py-16 md:py-24 border-b border-border transition-colors hover:border-primary/40 cursor-pointer overflow-hidden lg:overflow-visible">
                      <div className="flex-1 space-y-6 relative z-10">
                        <div className="flex items-center gap-6">
                          <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">{project.year}</span>
                          <div className="h-1 w-1 rounded-full bg-border" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{getTypeLabel(project.type)}</span>
                        </div>
                        <h2 className="font-display text-4xl sm:text-5xl md:text-9xl uppercase tracking-tighter transition-all group-hover:pl-6 group-hover:text-primary leading-[0.8]">
                          {project.name}
                        </h2>
                      </div>
                      
                      <div className="mt-8 md:mt-0 md:w-1/3 relative z-10">
                        <p className="text-xl text-muted-foreground font-medium max-w-sm leading-relaxed italic">
                          {project.tagline}
                        </p>
                      </div>

                       {/* TAP-TO-VIEW on mobile */}
                       <div className="flex md:hidden items-center gap-2 mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                         <ChevronRight className="h-3 w-3" />
                         Tap to view
                       </div>

                       {/* HOVER IMAGE PREVIEW - MOUSE FOLLOWING */}
                      <motion.div 
                        className="hidden lg:block fixed pointer-events-none z-50 overflow-hidden rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)]"
                        style={{
                          x: smoothX,
                          y: smoothY,
                          rotateX,
                          rotateY,
                          left: "50%",
                          top: "50%",
                          width: "450px",
                          height: "280px",
                          opacity: hoveredIndex === index ? 1 : 0,
                          scale: hoveredIndex === index ? 1 : 0.8,
                        }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {(() => {
                          const img = project.images?.[0] || project.image?.split('*')[0]?.trim();
                          return img ? (
                            <img 
                              src={img} 
                              alt="" 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Layers3 className="h-12 w-12 text-muted-foreground/20" />
                            </div>
                          );
                        })()}
                      </motion.div>

                       <div className="hidden md:flex h-20 w-20 lg:h-24 lg:w-24 items-center justify-center rounded-full border border-border group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-xl shadow-transparent group-hover:shadow-primary/20 relative z-10">
                         <ArrowUpRight className="h-8 w-8 lg:h-10 lg:w-10" />
                       </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="responsive-shell pt-60">
          <div className="grid gap-20 lg:grid-cols-2 items-center">
            <div>
              <h2 className="font-display text-6xl md:text-8xl leading-[0.85] tracking-tight mb-10">
                Interested in the <br /> <span className="text-primary italic">Architecture?</span>
              </h2>
              <p className="text-muted-foreground text-xl leading-relaxed max-w-md font-medium mb-12">
                I maintain a dedicated engineering lab where I showcase architectural diagrams, API benchmarks, and design system prototypes.
              </p>
              <Link to="/dev" className="h-16 inline-flex items-center px-10 rounded-full bg-foreground text-background font-medium hover:scale-105 transition-transform group">
                Engineering Lab
                <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="relative aspect-square lg:aspect-[4/3] rounded-[4rem] bg-card overflow-hidden border border-border p-12">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="h-16 w-16 rounded-2xl bg-foreground text-background flex items-center justify-center">
                    <Database className="h-8 w-8" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Version</span>
                    <div className="text-2xl font-display">v4.0.2</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full bg-primary" 
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Performance</span>
                    <span>98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-background/95 backdrop-blur-3xl p-4 sm:p-6"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[92vh] w-full max-w-7xl overflow-hidden rounded-[2rem] sm:rounded-[3rem] lg:rounded-[4rem] bg-card shadow-2xl flex flex-col border border-border"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-110 active:scale-95"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              <div className="flex-1 overflow-y-auto project-detail-scroll">
                {/* Visual Gallery */}
                {(() => {
                  const allImages = [
                    ...(selectedProject.images ?? []),
                    ...(selectedProject.image ? selectedProject.image.split('*').map(s => s.trim()).filter(Boolean) : [])
                  ];

                  if (allImages.length === 0) return null;

                  return (
                    <div className="w-full bg-muted/50 border-b border-border">
                      <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
                        {allImages.map((img, i) => (
                          <div 
                            key={i} 
                            className="flex-shrink-0 w-full snap-center relative aspect-[4/3] sm:aspect-[16/8]"
                          >
                            <img 
                              src={img} 
                              alt={`${selectedProject.name} visual ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      {allImages.length > 1 && (
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-background/80 backdrop-blur-md border border-border px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.4em]">
                          Slide to View Case Studies
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="p-5 sm:p-10 lg:p-20">
                  <div className="grid gap-10 lg:gap-24 lg:grid-cols-[1.3fr_0.7fr] items-start">
                    <div className="space-y-24">
                      <div className="space-y-12">
                        <div className="flex items-center gap-8">
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">{getTypeLabel(selectedProject.type)}</span>
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">{selectedProject.year}</span>
                        </div>
                        <h2 className="font-display text-4xl sm:text-6xl md:text-8xl leading-[0.85] tracking-tight">
                          {selectedProject.name}
                        </h2>
                        <p className="text-lg sm:text-2xl text-muted-foreground font-medium italic leading-tight">
                          {selectedProject.tagline}
                        </p>
                      </div>

                      <div className="space-y-16">
                        <div className="space-y-8">
                          <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary border-b border-border pb-6">The Concept</h3>
                          <div className="text-base sm:text-xl leading-relaxed font-medium text-foreground/80 space-y-4">
                            <p>{selectedProject.description || "Transforming complex requirements into a cohesive digital narrative. Our approach focused on high-density data visualization and seamless user flows."}</p>
                          </div>
                        </div>

                        {selectedProject.metrics && Object.keys(selectedProject.metrics).length > 0 && (
                          <div className="grid gap-12 sm:grid-cols-2">
                            {Object.entries(selectedProject.metrics).map(([key, value]) => (
                              <div key={key} className="space-y-4">
                                <div className="text-5xl font-display">{value.toLocaleString()}</div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">{key}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:sticky top-0 space-y-10 lg:space-y-16">
                      <div className="space-y-10">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground border-b border-border pb-6">Core Infrastructure</h3>
                        <div className="flex flex-wrap gap-4">
                          {selectedProject.stack.map((stack) => (
                            <span
                              key={stack}
                              className="bg-card border border-border px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xs font-bold uppercase tracking-widest"
                            >
                              {stack}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-6">
                        {selectedProject.url && (
                          <a
                            href={selectedProject.url.startsWith('http') ? selectedProject.url : `https://${selectedProject.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="h-14 sm:h-20 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-base sm:text-lg hover:scale-[1.02] active:scale-95 transition-all"
                          >
                            Explore Platform
                            <ArrowRight className="h-5 w-5 ml-4" />
                          </a>
                        )}
                        
                        {selectedProject.repo && (
                          <a
                            href={`https://${selectedProject.repo}`}
                            target="_blank"
                            rel="noreferrer"
                            className="h-14 sm:h-20 rounded-full border border-border flex items-center justify-center font-bold text-base sm:text-lg hover:bg-foreground hover:text-background transition-all"
                          >
                            Repository
                            <Github className="h-5 w-5 ml-4" />
                          </a>
                        )}
                      </div>

                      <div className="p-12 rounded-[3rem] bg-card border border-border">
                        <p className="text-sm font-display leading-relaxed italic text-muted-foreground">
                          "This project embodies our commitment to technical precision and human-centric design."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

