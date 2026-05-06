"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home, User, Briefcase, GraduationCap, Rocket, Zap, Box,
  Download, ArrowUpRight,
} from "lucide-react";

const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path></svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
import { useEffect, useRef } from "react";

type Item = { href: string; title: string; subtitle: string; Icon: React.ComponentType<{ className?: string }>; external?: boolean };

const col1: Item[] = [
  { href: "/", title: "Home", subtitle: "Hero + quick intro", Icon: Home },
  { href: "/about", title: "About", subtitle: "Who I am, what drives me", Icon: User },
  { href: "/experience", title: "Experience", subtitle: "Companies + roles", Icon: Briefcase },
  { href: "/education", title: "Education", subtitle: "Degrees + certs", Icon: GraduationCap },
];
const col2: Item[] = [
  { href: "/projects", title: "Projects", subtitle: "Featured builds", Icon: Rocket },
  { href: "/stack", title: "Tech stack", subtitle: "Languages, frameworks", Icon: Zap },
  { href: "/uses", title: "Uses", subtitle: "My setup and tools", Icon: Box },
];
const col3: Item[] = [
  { href: "/resume.pdf", title: "Resume", subtitle: "Download PDF", Icon: Download, external: true },
  { href: "https://github.com/Shaik-Sameer77", title: "GitHub", subtitle: "github.com/Shaik-Sameer77", Icon: Github, external: true },
  { href: "https://linkedin.com/in/shaik-sameer", title: "LinkedIn", subtitle: "Connect with me", Icon: Linkedin, external: true },
];

const Row = ({ item, muted = false, onSelect }: { item: Item; muted?: boolean; onSelect: () => void }) => {
  const inner = (
    <div className={`group flex items-start gap-3 rounded-lg p-3 transition-colors ${muted ? "hover:bg-background/60" : "hover:bg-surface"}`}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-foreground/80 group-hover:text-primary group-hover:border-primary/40">
        <item.Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-1 text-base font-semibold text-foreground">
          {item.title}
          {item.external && <ArrowUpRight className="h-3 w-3 text-muted-foreground" />}
        </div>
        <div className="text-sm text-muted-foreground truncate">{item.subtitle}</div>
      </div>
    </div>
  );
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" onClick={onSelect}>
        {inner}
      </a>
    );
  }
  return <Link href={item.href} onClick={onSelect}>{inner}</Link>;
};

export const NavMegaMenu = ({ onClose }: { onClose: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className="absolute left-1/2 top-full mt-3 w-[min(900px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-border bg-background/95 backdrop-blur-2xl p-3 shadow-2xl shadow-black/50"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <div className="px-3 pt-2 pb-1 text-[13px] font-medium uppercase tracking-wider text-muted-foreground">Me</div>
          {col1.map((i) => <Row key={i.title} item={i} onSelect={onClose} />)}
        </div>
        <div>
          <div className="px-3 pt-2 pb-1 text-[13px] font-medium uppercase tracking-wider text-muted-foreground">Work</div>
          {col2.map((i) => <Row key={i.title} item={i} onSelect={onClose} />)}
        </div>
        <div className="rounded-lg bg-surface/60 p-1">
          <div className="px-3 pt-2 pb-1 text-[13px] font-medium uppercase tracking-wider text-muted-foreground">Quick links</div>
          {col3.map((i) => <Row key={i.title} item={i} muted onSelect={onClose} />)}
        </div>
      </div>
    </motion.div>
  );
};
