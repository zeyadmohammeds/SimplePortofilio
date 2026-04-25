import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useApi } from "@/hooks/use-api";
import { SideScrollIndicator } from "@/components/ui/side-scroll-indicator";
import { motion } from "framer-motion";
import { GraduationCap, BadgeCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: "Education - Zeyad Mohammed" },
      { name: "description", content: "Academic background and continuous learning journey." },
    ],
  }),
  component: EducationPage,
});

interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

function EducationPage() {
  const education = useApi<Education[]>("/api/education");

  return (
    <PageShell>
      <SideScrollIndicator />
      <div className="pb-64 pt-40 lg:pt-56">
        <section className="responsive-shell">
          <div className="grid lg:grid-cols-[0.4fr_0.6fr] gap-32 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="sticky top-40 space-y-12"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-8 block">Legacy & Growth</span>
                <h1 className="font-display text-8xl md:text-9xl leading-[0.8] tracking-tighter">
                  Academic <br /> <span className="text-muted-foreground/20 italic">Pedigree.</span>
                </h1>
              </div>
              
              <p className="text-2xl text-muted-foreground font-medium leading-relaxed italic max-w-sm">
                "The foundation of every complex system is a robust theoretical understanding."
              </p>

              <div className="pt-12 border-t border-border/50">
                <div className="flex items-center gap-4 group cursor-help">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Alumnus</div>
                    <div className="text-sm font-bold">Class of 2024</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-48">
              {/* DEGREES TIMELINE */}
              <div className="space-y-16">
                <div className="divide-y divide-border/50">
                  {(education.data || []).map((edu, i) => (
                    <motion.div 
                      key={edu.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="group py-20 flex flex-col gap-10 hover:bg-muted/30 transition-colors px-8 -mx-8 rounded-[3rem]"
                    >
                      <div className="flex items-center justify-between">
                         <span className="font-display text-2xl text-muted-foreground/30 italic">0{i+1}</span>
                         <span className="text-4xl font-display text-primary">{edu.year}</span>
                      </div>
                      
                      <div className="space-y-6">
                        <h3 className="text-5xl md:text-7xl font-display uppercase tracking-tighter leading-none group-hover:text-primary transition-all duration-700">
                          {edu.degree}
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="h-[1px] w-12 bg-primary/30" />
                          <p className="text-2xl text-muted-foreground font-medium uppercase tracking-tight">{edu.school}</p>
                        </div>
                      </div>

                      <p className="text-lg text-muted-foreground/60 leading-relaxed max-w-xl font-medium">
                        Specializing in distributed systems and high-performance computing architectures. Achieved excellence through rigorous technical implementation and research.
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CERTIFICATIONS GRID */}
              <div className="space-y-16 pt-32 border-t border-border/30">
                <div className="flex items-end justify-between mb-8">
                  <h2 className="font-display text-5xl md:text-6xl tracking-tighter uppercase">Specializations</h2>
                  <BadgeCheck className="h-8 w-8 text-muted-foreground/20" />
                </div>
                
                <div className="grid gap-8 sm:grid-cols-2">
                  {[
                    "Advanced Cloud Architecture",
                    "Cybersecurity Excellence",
                    "Strategic Tech Leadership",
                    "Product Design Systems",
                    "AI & Machine Learning Foundations",
                    "Resilient Backend Engineering"
                  ].map((cert, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="p-10 rounded-[3rem] bg-white border border-border hover:border-primary/30 transition-all group dark:bg-white/5"
                    >
                      <div className="flex justify-between items-start mb-12">
                        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
                          <Sparkles className="h-6 w-6" />
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 group-hover:text-primary/40 transition-colors">EST. 2023</div>
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">{cert}</h3>
                      <div className="h-1 w-0 bg-primary/20 group-hover:w-full transition-all duration-700 rounded-full" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
