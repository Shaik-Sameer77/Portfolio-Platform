"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Code, Cpu, ShieldCheck } from "lucide-react";

const STAGES = [
  { text: "INITIALIZING PORTFOLIO ENGINE...", icon: Terminal, color: "text-blue-500 dark:text-blue-400" },
  { text: "CONNECTING TO THE CORE PLATFORM...", icon: Cpu, color: "text-amber-500 dark:text-amber-400" },
  { text: "FETCHING HIGH-PERFORMANCE ASSETS...", icon: Code, color: "text-emerald-500 dark:text-emerald-400" },
  { text: "HYDRATING THE REACTIVE INTERFACE...", icon: ShieldCheck, color: "text-indigo-500 dark:text-indigo-400" },
  { text: "RESOLVING SENIOR ENGINEERING METRICS...", icon: Terminal, color: "text-purple-500 dark:text-purple-400" },
  { text: "COMPILING MEMORY CHUNKS & MODULES...", icon: Cpu, color: "text-rose-500 dark:text-rose-400" },
  { text: "SYSTEM STATUS: PERFECT & SECURE.", icon: ShieldCheck, color: "text-teal-500 dark:text-teal-400" },
];

export const DevLoader = ({ fullScreen = true }: { fullScreen?: boolean }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [percentage, setPercentage] = useState(0);

  // Loading percentage animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 4) + 1;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // System status text sequence
  useEffect(() => {
    let charIndex = 0;
    const stageInfo = STAGES[currentStage];
    setTypedText("");

    const typingInterval = setInterval(() => {
      if (charIndex < stageInfo.text.length) {
        setTypedText((prev) => prev + stageInfo.text.charAt(charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        
        // Wait a short bit, then push current stage to history and advance
        setTimeout(() => {
          setHistory((prev) => {
            const nextHistory = [...prev, stageInfo.text];
            if (nextHistory.length > 4) {
              nextHistory.shift(); // Keep logs concise
            }
            return nextHistory;
          });
          
          setCurrentStage((prev) => (prev + 1) % STAGES.length);
        }, 1200);
      }
    }, 25);

    return () => clearInterval(typingInterval);
  }, [currentStage]);

  // Generate floaty binary background particles
  const [particles, setParticles] = useState<{ id: number; text: string; x: number; y: number; delay: number; duration: number }[]>([]);
  useEffect(() => {
    const initialParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      text: Math.random() > 0.5 ? "0" : "1",
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 10,
    }));
    setParticles(initialParticles);
  }, []);

  return (
    <div className={fullScreen ? "splash-overlay fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/95 dark:bg-black/95 px-4 overflow-hidden select-none" : "relative w-full min-h-[60vh] flex flex-col items-center justify-center bg-transparent px-4 overflow-hidden select-none py-12"}>
      {/* Dynamic flowing binary ambient particles */}
      {fullScreen && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.03]">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute text-primary text-xs font-mono"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              animate={{
                y: ["0px", "-150px"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear",
              }}
            >
              {p.text}
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating subtle glowing orb backgrounds */}
      {fullScreen && (
        <>
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        </>
      )}

      {/* Inner branding logo loader */}
      <div className="relative mb-10 flex items-center justify-center">
        {/* Outer counter-rotating braces */}
        <motion.div
          className="absolute text-5xl md:text-6xl font-mono text-slate-400/30 dark:text-muted-foreground/30 font-light select-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          {"{      }"}
        </motion.div>

        {/* Outer neon halo rings */}
        <div className="absolute w-24 h-24 rounded-full border border-primary/10 dark:border-primary/20 animate-pulse" />
        <div className="absolute w-28 h-28 rounded-full border border-dashed border-indigo-500/5 dark:border-indigo-500/10 animate-[spin_40s_linear_infinite]" />

        {/* Center glowing brackets */}
        <motion.div
          className="z-10 flex items-center justify-center bg-white/80 dark:bg-surface/80 border border-slate-200/80 dark:border-border/80 backdrop-blur-md rounded-2xl w-16 h-16 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] dark:shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)]"
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Code className="h-7 w-7 text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)] dark:drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
        </motion.div>
      </div>

      {/* Main glassmorphism terminal window */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-800 bg-slate-950/90 backdrop-blur-xl shadow-2xl"
      >
        {/* IDE Titlebar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/80 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80 transition-colors hover:bg-rose-500" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80 transition-colors hover:bg-amber-500" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80 transition-colors hover:bg-emerald-500" />
          </div>
          <span className="text-[10px] md:text-xs font-mono font-medium text-slate-400 tracking-wide select-none">
            guest@sameer-portfolio:~
          </span>
          <div className="w-12" />
        </div>

        {/* Terminal output stream container */}
        <div className="p-5 font-mono text-xs text-slate-300 min-h-[160px] flex flex-col justify-end space-y-2">
          {/* History log lines */}
          <div className="space-y-1.5 opacity-60">
            {history.map((log, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400">
                <span className="text-primary/70 font-bold select-none">&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>

          {/* Active typing log line */}
          <div className="flex items-start gap-2 pt-1">
            <span className="text-primary font-bold animate-pulse select-none">&gt;</span>
            <span className="text-slate-100 font-semibold flex-1">
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block ml-0.5 bg-primary w-2 h-4 align-middle"
              />
            </span>
          </div>
        </div>

        {/* Bottom utility progress bar */}
        <div className="border-t border-slate-800/60 bg-slate-950/40 px-5 py-3.5 flex items-center justify-between gap-4">
          <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-indigo-500 to-teal-400"
              style={{ width: `${percentage}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-primary min-w-[36px] text-right">
            {percentage}%
          </span>
        </div>
      </motion.div>

      {/* Creative subtitle branding */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0.75] }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-6 text-[10px] md:text-xs font-mono uppercase tracking-widest text-slate-600 dark:text-muted-foreground/80 font-medium text-center px-4"
      >
        Designed &amp; Engineered by Shaik Sameer &bull; Senior Developer Core
      </motion.p>
    </div>
  );
};
