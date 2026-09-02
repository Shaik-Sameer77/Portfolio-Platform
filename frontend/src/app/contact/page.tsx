"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Mail, Clock, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/data/mock";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { toast } from "sonner";
import { BookingCalendar } from "@/components/BookingCalendar";
import { submitContactForm } from "@/services/contact-service";
import { getSocialLinks, type SocialLinks } from "@/services/portfolio-service";

const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path></svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const subjects = ["Job opportunity", "Freelance project", "Just saying hi", "Other"];

export default function Contact() {
  const [activeTab, setActiveTab] = useState<"message" | "book">("book");
  const [form, setForm] = useState({ name: "", email: "", subject: subjects[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socials, setSocials] = useState<SocialLinks | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSocialLinks()
      .then((data) => setSocials(data))
      .catch((err) => console.warn("Failed to fetch social links on Contact page:", err));
  }, []);

  const github = socials?.github || profile.github;
  const linkedin = socials?.linkedin || profile.linkedin;
  const email = socials?.email || profile.email;

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Valid email required";
    if (form.message.trim().length < 10) errs.message = "At least 10 characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    
    setIsSubmitting(true);
    try {
      await submitContactForm(form);
      toast.success("Message sent — I'll get back to you within 48 hours.");
      setForm({ name: "", email: "", subject: subjects[0], message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Contact" title="Let's talk." subtitle="The fastest way to reach me. I read everything." />
      <div className="container-page pb-24 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="space-y-4 text-sm">
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 hover:border-primary/40">
                <Mail className="h-4 w-4 text-primary" /> {email}
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 hover:border-primary/40">
                <Linkedin className="h-4 w-4 text-primary" /> LinkedIn
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 hover:border-primary/40">
                <Github className="h-4 w-4 text-primary" /> {github.replace(/^https?:\/\//, '')}
              </a>
            )}
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

        <div className="space-y-6">
          <div className="flex p-1 bg-surface-2 rounded-xl border border-border">
            <button
              onClick={() => setActiveTab("book")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "book" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Book Appointment
            </button>
            <button
              onClick={() => setActiveTab("message")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "message" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Send Message
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "book" ? (
              <motion.div key="book" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <BookingCalendar />
              </motion.div>
            ) : (
              <motion.form key="message" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-surface p-6">
                <Field label="Your name" error={errors.name}>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
                </Field>
                <Field label="Email address" error={errors.email}>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
                </Field>
                <Field label="Subject">
                  <div className="relative" ref={selectRef}>
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      onKeyDown={handleKeyDown}
                      aria-haspopup="listbox"
                      aria-expanded={isOpen}
                      className="input flex w-full items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <span>{form.subject}</span>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          role="listbox"
                          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-popover py-1 shadow-lg focus:outline-none text-popover-foreground"
                        >
                          {subjects.map((sub) => (
                            <li
                              key={sub}
                              role="option"
                              aria-selected={form.subject === sub}
                              onClick={() => {
                                setForm({ ...form, subject: sub });
                                setIsOpen(false);
                              }}
                              className={`cursor-pointer px-4 py-2.5 text-sm transition-colors ${
                                form.subject === sub ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                              }`}
                            >
                              {sub}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </Field>
                <Field label="Message" error={errors.message}>
                  <textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input resize-none" />
                </Field>
                <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? "Sending..." : "Send message"}
                </button>
                {email && <p className="text-xs text-muted-foreground">Prefer email? Reach me directly at {email}.</p>}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
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
