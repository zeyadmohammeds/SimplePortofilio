import { createFileRoute, Link } from "@tanstack/react-router";
import { useApi } from "@/hooks/use-api";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink, Github, Layers, ChevronRight, LayoutGrid } from "lucide-react";
import { Magnetic } from "@/components/ui/magnetic";

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

export const Route = createFileRoute("/projects/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Project Detail — Zeyad Mohammed` },
      { name: "description", content: "Immersive project breakdown with technical architecture insights." },
    ],
  }),
  component: ProjectDetail,
});

function getTypeLabel(type: string | number) {
  if (typeof type === "number") {
    return ["frontend", "backend", "fullstack", "mobile"][type] ?? "fullstack";
  }
  return type?.toString().toLowerCase() || "fullstack";
}

function ProjectDetail() {
  const { id } = Route.useParams();
  const { data: projects, loading } = useApi<Project[]>("/api/projects");
  const project = Array.isArray(projects) ? projects.find((p) => p.id === id) : null;

  const { scrollYProgress } = useScroll();

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, 200]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.15], [0, 8]);

  const allImages = [
    ...(project?.images ?? []),
    ...(project?.image ? project.image.split('*').map(s => s.trim()).filter(Boolean) : [])
  ];

  if (!project && loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center space-y-8">
            <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Layers className="h-8 w-8 text-muted-foreground/30 animate-pulse" />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Loading Project</div>
            <div className="h-1 w-48 mx-auto rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </div>
          </div>
        </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
          <div className="text-center max-w-lg">
            <div className="h-24 w-24 mx-auto rounded-[2.5rem] bg-muted flex items-center justify-center mb-10 border border-border">
              <LayoutGrid className="h-10 w-10 text-muted-foreground/20" />
            </div>
            <h1 className="font-display text-6xl leading-[0.85] tracking-tight mb-8">Project <br /><span className="text-muted-foreground/20 italic">Not Found.</span></h1>
            <p className="text-lg text-muted-foreground font-medium mb-12">The requested project doesn't exist or has been archived.</p>
            <Link to="/projects" className="inline-flex items-center gap-3 h-16 px-10 rounded-full bg-foreground text-background font-bold text-sm hover:scale-105 transition-transform">
              <ArrowLeft className="h-4 w-4" /> Back to Projects
            </Link>
          </div>
        </div>
    );
  }

  return (
      <div className="pb-32">
        {/* Back Navigation */}
        <div className="responsive-shell pt-10 lg:pt-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/projects"
              className="group inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 hover:text-foreground transition-all"
            >
              <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-300">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span>Back to Projects</span>
            </Link>
          </motion.div>
        </div>

        {/* Hero Section */}
        <section
          className="relative mt-12 lg:mt-16 mx-4 lg:mx-8 h-[80vh] min-h-[500px] lg:min-h-[700px] overflow-hidden rounded-[2rem] lg:rounded-[3rem]"
        >
          <motion.div style={{ scale: heroScale }} className="absolute inset-0">
            {allImages[0] ? (
              <motion.img
                style={{ filter: `blur(${heroBlur}px)` }}
                src={allImages[0]}
                alt={project.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/5 via-muted to-background" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />
          </motion.div>

          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="absolute bottom-0 left-0 right-0 p-10 sm:p-16 lg:p-24"
          >
            <div className="max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 mb-6 lg:mb-8"
              >
                <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em] text-white border border-white/10">
                  {getTypeLabel(project.type)}
                </span>
                <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-white/50">
                  {project.year}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] leading-[0.85] tracking-tight text-white"
              >
                {project.name}
              </motion.h1>

              {project.tagline && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-lg sm:text-xl md:text-2xl text-white/60 font-medium mt-6 lg:mt-8 max-w-3xl leading-relaxed"
                >
                  {project.tagline}
                </motion.p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-6 lg:bottom-10 right-6 lg:right-10"
          >
            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 animate-bounce">
              <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5 text-white rotate-90" />
            </div>
          </motion.div>
        </section>

        {/* Content Grid */}
        <div className="responsive-shell mt-24 lg:mt-40">
          <div className="grid gap-16 lg:gap-32 lg:grid-cols-[1.3fr_0.7fr] items-start">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="space-y-20 lg:space-y-32"
            >
              {/* Description */}
              <div className="space-y-8">
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary block"
                >
                  The Concept
                </motion.span>
                <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-medium leading-[1.5] lg:leading-[1.6]">
                  {project.description || "Transforming complex requirements into a cohesive digital narrative. This project focused on high-density data visualization and seamless user flows."}
                </p>
              </div>

              {/* Image Gallery */}
              {allImages.length > 1 && (
                <div className="space-y-10 lg:space-y-12">
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary block"
                  >
                    Visual Archive
                  </motion.span>
                  <div className="grid gap-6 lg:gap-8">
                    {allImages.slice(1).map((img, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="aspect-[16/9] rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden bg-muted shadow-2xl shadow-black/5 group"
                      >
                        <img
                          src={img}
                          alt={`${project.name} visual ${i + 2}`}
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metrics */}
              {project.metrics && Object.keys(project.metrics).length > 0 && (
                <div className="space-y-10 lg:space-y-12">
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary block"
                  >
                    Performance Metrics
                  </motion.span>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {Object.entries(project.metrics).map(([key, value], i) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.6 }}
                        className="p-8 lg:p-10 rounded-[2rem] lg:rounded-[3rem] bg-card border border-border group hover:border-primary/20 transition-all duration-700"
                      >
                        <div className="text-5xl lg:text-6xl font-display text-foreground mb-3 lg:mb-4">{value.toLocaleString()}</div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50 group-hover:text-primary/60 transition-colors">{key}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider for spacing */}
              <div className="h-px w-full bg-border/50" />
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="lg:sticky lg:top-40 space-y-10 lg:space-y-16"
            >
              {/* Tech Stack */}
              <div className="p-8 lg:p-10 rounded-[2rem] lg:rounded-[3rem] bg-card border border-border">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary block mb-8">Core Stack</span>
                <div className="flex flex-wrap gap-2 lg:gap-3">
                  {project.stack.map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      className="px-4 lg:px-5 py-2 lg:py-2.5 rounded-full border border-border bg-background text-[10px] font-bold uppercase tracking-widest text-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 lg:space-y-6">
                {project.url && (
                  <Magnetic strength={0.2}>
                    <a
                      href={project.url.startsWith('http') ? project.url : `https://${project.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group h-14 lg:h-16 w-full rounded-full bg-foreground text-background flex items-center justify-center gap-3 font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10"
                    >
                      Explore Platform
                      <ExternalLink className="h-4 w-4 lg:h-5 lg:w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  </Magnetic>
                )}

                {project.repo && (
                  <Magnetic strength={0.2}>
                    <a
                      href={`https://${project.repo}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group h-14 lg:h-16 w-full rounded-full border border-border flex items-center justify-center gap-3 font-bold text-sm hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
                    >
                      View Repository
                      <Github className="h-4 w-4 lg:h-5 lg:w-5" />
                    </a>
                  </Magnetic>
                )}
              </div>

              {/* Insight Card */}
              <div className="p-8 lg:p-10 rounded-[2rem] lg:rounded-[3rem] bg-card border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Architectural Note</span>
                </div>
                <p className="text-base lg:text-lg font-display leading-relaxed italic text-muted-foreground/80">
                  "This project embodies a commitment to technical precision and human-centric design."
                </p>
              </div>

              {/* Project Meta */}
              <div className="p-8 lg:p-10 rounded-[2rem] lg:rounded-[3rem] bg-card border border-border">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary block mb-6">Project Info</span>
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Classification</span>
                    <span className="text-sm font-bold uppercase tracking-wider">{getTypeLabel(project.type)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Year</span>
                    <span className="text-sm font-bold font-mono">{project.year}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Components</span>
                    <span className="text-sm font-bold">{project.stack.length} Technologies</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <section className="responsive-shell mt-40 lg:mt-60">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="border-t border-border pt-16 lg:pt-20"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 lg:gap-20">
              <div className="max-w-2xl">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary block mb-6">Continue Exploring</span>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.85] tracking-tight">
                  Interested in the <br /> <span className="italic text-muted-foreground/20">Architecture?</span>
                </h2>
                <p className="text-lg text-muted-foreground font-medium mt-6 leading-relaxed">
                  Browse the full collection of projects spanning frontend, backend, full-stack, and mobile.
                </p>
              </div>
              <Link
                to="/projects"
                className="group inline-flex items-center gap-4 h-14 lg:h-16 px-10 rounded-full bg-foreground text-background font-bold text-sm hover:scale-105 transition-transform shrink-0"
              >
                View All Projects
                <ArrowUpRight className="h-4 w-4 lg:h-5 lg:w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
  );
}

export default ProjectDetail;
