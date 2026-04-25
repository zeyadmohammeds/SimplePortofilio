import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useApi } from "@/hooks/use-api";
import { SideScrollIndicator } from "@/components/ui/side-scroll-indicator";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Magnetic } from "@/components/ui/magnetic";
import { ArrowRight, Briefcase, GraduationCap, Github, Linkedin, Mail, Twitter, Instagram } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About - Zeyad Mohammed" },
      { name: "description", content: "Background, values, and product-focused full-stack work." },
    ],
  }),
  component: About,
});

interface Profile {
  name: string;
  title: string;
  bio: string;
  pitch: string;
  location: string;
  availability: string;
}

function About() {
  const experiences = useApi<any[]>("/api/experiences");
  const education = useApi<any[]>("/api/education");
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <PageShell>
      <SideScrollIndicator />
      <div ref={containerRef} className="pb-32 pt-40 lg:pt-56 overflow-hidden">
        <section className="responsive-shell">
          {/* INTRO */}
          <div className="grid gap-20 lg:grid-cols-[1.2fr_0.8fr] items-start mb-40">
            <motion.div
              style={{ y: textY }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-8 block">The Biography</span>
              <h1 className="font-display text-7xl md:text-9xl leading-[0.85] tracking-tight mb-16">
                Engineer of <br /> <span className="text-muted-foreground/30 italic">Digital</span> Experiences.
              </h1>
              
              <div className="space-y-8 text-2xl md:text-3xl text-muted-foreground font-medium leading-[1.4] max-w-3xl">
                <p>
                  I'm Zeyad Mohammed, a Software Architect based in Cairo, Egypt. My work is defined by the intersection of <span className="text-foreground">technical rigor</span> and <span className="text-foreground">visual excellence</span>.
                </p>
                <p>
                  With over 4 years of experience building scalable systems, I specialize in architecting complex frontend applications and resilient backend ecosystems that prioritize user experience and performance.
                </p>
              </div>
            </motion.div>

            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-muted shadow-2xl shadow-black/10">
              <motion.img 
                style={{ y: imgY, scale: 1.1 }}
                src="/public/me.png" 
                alt="Zeyad Mohammed"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
            </div>
          </div>

          <div className="grid gap-24 lg:grid-cols-2">
            {/* EXPERIENCE */}
            <div className="space-y-16">
              <div className="flex items-center justify-between border-b border-border pb-8">
                <h2 className="font-display text-4xl uppercase tracking-tight">Experience</h2>
                <Briefcase className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="space-y-12">
                {(experiences.data || []).map((exp: any, i) => (
                  <motion.div 
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-display uppercase tracking-tight group-hover:text-primary transition-colors">{exp.position}</h3>
                        <p className="text-muted-foreground font-medium">{exp.company}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pt-2">
                        {exp.startDate} — {exp.endDate || "Present"}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                      {exp.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* EDUCATION & PHILOSOPHY */}
            <div className="space-y-24">
              <div className="space-y-16">
                <div className="flex items-center justify-between border-b border-border pb-8">
                  <h2 className="font-display text-4xl uppercase tracking-tight">Education</h2>
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="space-y-12">
                  {(education.data || []).map((edu: any, i) => (
                    <motion.div 
                      key={edu.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-display uppercase tracking-tight">{edu.degree}</h3>
                          <p className="text-muted-foreground font-medium">{edu.school}</p>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pt-2">{edu.year}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-8 p-12 rounded-[3rem] bg-card border border-border">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Philosophy</h3>
                <p className="text-xl font-display leading-relaxed italic">
                  "Architecture is not just about structure, it's about the emotional resonance of the digital environment."
                </p>
                <div className="pt-8 flex gap-4">
                  <Magnetic strength={0.3}>
                    <a href="#" className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all">
                      <Github className="h-5 w-5" />
                    </a>
                  </Magnetic>
                  <Magnetic strength={0.3}>
                    <a href="#" className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </Magnetic>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
