import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { useApi } from "@/hooks/use-api";
import { useRef } from "react";
import { Magnetic } from "@/components/ui/magnetic";
import { TiltCard } from "@/components/ui/tilt-card";
import { SideScrollIndicator } from "@/components/ui/side-scroll-indicator";

export const Route = createFileRoute("/")({ component: Index });

interface Project {
  id: string;
  name: string;
  tagline: string;
  stack: string[];
  year: number;
  image?: string;
  images?: string[];
}

function Index() {
  const projects = useApi<Project[]>("/api/projects");
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ 
    target: heroRef, 
    offset: ["start start", "end start"] 
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.98]);

  const projectsList = Array.isArray(projects.data) ? projects.data : [];

  return (
    <PageShell>
      <SideScrollIndicator />
      <div className="pb-32">
        {/* HERO SECTION */}
        <section ref={heroRef} className="responsive-shell relative pt-40 lg:pt-60 min-h-[90vh] flex flex-col items-center text-center">
          <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="max-w-6xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-[0.2em] mb-12"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Available for New Endeavors
            </motion.div>

            <motion.h1
              className="font-display text-7xl sm:text-9xl lg:text-[11rem] tracking-tight leading-[0.8] text-foreground mb-16 overflow-hidden"
            >
              {"Zeyad".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ 
                    duration: 1.2, 
                    delay: i * 0.05, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
              <span className="inline-block w-4 sm:w-8" />
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1.5 }}
                className="text-muted-foreground/30 italic"
              >
                Mohammed
              </motion.span> 
              <br />
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-foreground/90 inline-block"
              >
                Software Architect.
              </motion.span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="flex flex-col items-center gap-12"
            >
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl text-balance">
                Specializing in the intersection of <span className="text-foreground">premium aesthetics</span> and <span className="text-foreground">robust technical engineering</span>. 
                Based in Cairo, Egypt.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6">
                <Magnetic strength={0.3}>
                  <Link to="/projects" className="h-16 flex items-center px-10 rounded-full bg-foreground text-background font-medium hover:scale-105 transition-transform shadow-xl shadow-black/10">
                    Explore my work
                  </Link>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <Link to="/contact" className="h-16 flex items-center px-10 rounded-full border border-border font-medium hover:bg-muted transition-colors">
                    Start a conversation
                  </Link>
                </Magnetic>
              </div>
            </motion.div>
          </motion.div>
          
        </section>

        {/* SELECTED PROJECTS GRID */}
        <section className="responsive-shell pt-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Selected Projects</span>
              <h2 className="font-display text-6xl lg:text-8xl leading-none">The <span className="italic">Portfolio.</span></h2>
            </div>
            <Link to="/projects" className="group flex items-center gap-3 text-sm font-medium uppercase tracking-widest hover:text-primary transition-colors pb-2">
              View all works
              <div className="h-10 w-10 flex items-center justify-center rounded-full border border-border group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>

          <div className="grid gap-x-8 gap-y-32 lg:grid-cols-2">
            {projectsList.slice(0, 4).map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i % 2 * 0.1 }}
                className={`flex flex-col group ${i % 2 === 1 ? 'lg:mt-32' : ''}`}
              >
                <TiltCard className="block w-full">
                  <Link to={`/projects/${project.id}`} className="block">
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-[2.5rem] bg-muted relative mb-10 shadow-2xl shadow-black/5 ring-1 ring-black/5 transition-transform duration-700">
                      {(() => {
                        const firstImage = (project.images?.[0] || project.image?.split('*')[0]?.trim());
                        if (firstImage) {
                          return (
                            <img 
                              src={firstImage} 
                              alt={project.name}
                              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                          );
                        }
                        return <div className="h-full w-full bg-gradient-to-br from-muted to-border/20" />;
                      })()}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                        <div className="h-20 w-20 rounded-full bg-white text-black flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                          <ArrowUpRight className="h-8 w-8" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-2">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">{project.year}</span>
                          <div className="h-1 w-1 rounded-full bg-border" />
                          <div className="flex gap-2">
                            {project.stack.slice(0, 2).map(s => (
                              <span key={s} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <h3 className="font-display text-5xl mb-4 group-hover:text-primary transition-colors leading-none uppercase tracking-tighter">{project.name}</h3>
                      <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-md">{project.tagline}</p>
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TECH MARQUEE */}
        <section className="mt-20 py-40 border-y border-border overflow-hidden bg-muted/30">
          <div className="flex whitespace-nowrap">
            {[1, 2].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0 }}
                animate={{ x: "-100%" }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="flex gap-20 px-10 items-center"
              >
                {["React", ".NET Core", "PostgreSQL", "Framer Motion", "TypeScript", "TailwindCSS", "Three.js", "Docker", "Redis", "Vite"].map(tech => (
                  <span key={tech} className="font-display text-6xl md:text-8xl uppercase tracking-tighter text-muted-foreground/20 hover:text-primary transition-colors cursor-default">
                    {tech}
                  </span>
                ))}
              </motion.div>
            ))}
          </div>
        </section>

        {/* REFINED EXPERTISE SECTION */}
        <section className="responsive-shell pt-60 pb-20">
          <div className="grid gap-24 lg:grid-cols-[1fr_1.5fr] items-start">
            <div className="sticky top-40">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-6 block">Capabilities</span>
              <h2 className="font-display text-6xl lg:text-8xl leading-[0.9] mb-10">Expertise <br /> & <span className="italic">Vision.</span></h2>
              <p className="text-muted-foreground text-xl leading-relaxed max-w-md font-medium">
                I bridge the gap between high-level conceptual design and production-ready technical architecture.
              </p>
            </div>
            
            <div className="grid gap-16">
              {[
                {
                  title: "Frontend Architecture",
                  desc: "Creating immersive, high-performance interfaces that tell a story through motion and intentional user flow.",
                  tags: ["React", "Framer Motion", "Tailwind", "Vite"]
                },
                {
                  title: "System Design",
                  desc: "Building resilient backends and distributed systems that scale alongside user demand without compromising performance.",
                  tags: [".NET", "PostgreSQL", "Redis", "Docker"]
                },
                {
                  title: "Visual Identity",
                  desc: "Crafting digital identities that resonate through sophisticated typography, balanced layouts, and premium interactions.",
                  tags: ["UI/UX", "Brand Design", "Art Direction"]
                }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group flex flex-col md:flex-row gap-8 pb-16 border-b border-border"
                >
                  <div className="text-4xl font-display text-muted-foreground/20 group-hover:text-primary transition-colors leading-none">0{i+1}</div>
                  <div className="space-y-6">
                    <h3 className="text-4xl font-display uppercase tracking-tight">{item.title}</h3>
                    <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                      {item.desc}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {item.tags.map(tag => (
                        <span key={tag} className="px-4 py-1 rounded-full border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:border-primary/30 group-hover:text-foreground transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default Index;
