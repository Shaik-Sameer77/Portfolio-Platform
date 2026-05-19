"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Mail, Clock, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/data/mock";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { toast } from "sonner";

const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path></svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const subjects = ["Job opportunity", "Freelance project", "Just saying hi", "Other"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: subjects[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Valid email required";
    if (form.message.trim().length < 10) errs.message = "At least 10 characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    toast.success("Message sent — I'll get back to you within 48 hours.");
    setForm({ name: "", email: "", subject: subjects[0], message: "" });
  };

  return (
    <>
      <PageHeader eyebrow="Contact" title="Let's talk." subtitle="The fastest way to reach me. I read everything." />
      <div className="container-page pb-24 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="space-y-4 text-sm">
            <a href={`mailto:${profile.email}`} className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 hover:border-primary/40">
              <Mail className="h-4 w-4 text-primary" /> {profile.email}
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 hover:border-primary/40">
              <Linkedin className="h-4 w-4 text-primary" /> LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 hover:border-primary/40">
              <Github className="h-4 w-4 text-primary" /> github.com/Shaik-Sameer77
            </a>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" /> Response time: within 48 hours
            </div>
          </div>
          <div className="mt-8 rounded-xl border border-border bg-surface p-5">
            <AvailabilityBadge available={profile.available} label="Available" />
            <p className="mt-2 text-sm text-muted-foreground">
              Currently available for full-time roles and select freelance projects.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-surface p-6">
          <Field label="Name" error={errors.name}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          </Field>
          <Field label="Email" error={errors.email}>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
          </Field>
          <Field label="Subject">
            <div ref={selectRef} className="relative w-full" onKeyDown={handleKeyDown}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`input flex items-center justify-between text-left transition-all duration-200 ${
                  isOpen ? "border-primary ring-1 ring-primary/20" : ""
                }`}
              >
                <span>{form.subject}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute left-0 right-0 mt-2 rounded-lg border border-border bg-surface-2 p-1 shadow-2xl z-50"
                  >
                    {subjects.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, subject: s });
                          setIsOpen(false);
                        }}
                        className={`w-full rounded-md px-3.5 py-2 text-left text-sm transition-all duration-150 ${
                          form.subject === s
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-foreground hover:bg-surface"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Field>
          <Field label="Message" error={errors.message}>
            <textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input resize-none" />
          </Field>
          <button type="submit" className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Send message
          </button>
          <p className="text-xs text-muted-foreground">Prefer email? Reach me directly at {profile.email}.</p>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: hsl(var(--foreground));
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus { border-color: hsl(var(--primary)); }
      `}</style>
    </>
  );
}

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
      <span>{label}</span>
      {error && <span className="text-destructive">{error}</span>}
    </span>
    {children}
  </label>
);
