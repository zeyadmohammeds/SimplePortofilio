import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function SideScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      if (latest > 0.05) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    });
  }, [scrollYProgress]);

  return (
    <div className="fixed right-8 lg:right-12 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-10">
      {/* SCROLL PROGRESS TRACK */}
      <div className="h-48 w-[2px] bg-border/30 relative overflow-hidden rounded-full">
        <motion.div 
          style={{ scaleY }}
          className="absolute inset-0 bg-primary origin-top"
        />
      </div>

      {/* EXPLORE PROMPT */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0,
          x: isVisible ? 0 : 20,
          pointerEvents: isVisible ? "auto" : "none"
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-6"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground whitespace-nowrap [writing-mode:vertical-lr] rotate-180">
          Scroll to explore
        </span>
        
        <motion.div 
          animate={{ 
            y: [0, 12, 0],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-[2px] h-12 bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>
    </div>
  );
}
