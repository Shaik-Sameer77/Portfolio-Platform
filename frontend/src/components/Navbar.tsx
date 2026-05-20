"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { NavMegaMenu } from "./NavMegaMenu";
import { useUIStore } from "@/store/useUIStore";
import { useTheme } from "next-themes";
import { profile } from "@/data/mock";
import { getProfile, type Profile } from "@/services/portfolio-service";

const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Services", href: "/services" },
  { label: "Tools", href: "/tools" },
  { label: "Gallery", href: "/gallery" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { megaOpen, setMega, drawerOpen, setDrawer } = useUIStore();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profileData, setProfileData] = useState<Profile | null>(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    getProfile()
      .then((data) => setProfileData(data))
      .catch((err) => console.warn("Failed to fetch profile in Navbar:", err));
  }, []);

  useEffect(() => {
    setMega(false);
    setDrawer(false);
  }, [pathname, setMega, setDrawer]);

  const activeResumeUrl = profileData?.resumeUrl || profile.resumeUrl || "/resume.pdf";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all ${
          scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border" : "bg-background/40 backdrop-blur-md"
        }`}
      >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-10">
        {/* Logo */}
        <Link href="/" className="text-base font-semibold tracking-tight text-foreground">
          {profile.handle}
        </Link>

        {/* Center nav */}
        <nav 
          className="relative hidden items-center gap-1 md:flex"
          onMouseLeave={() => setMega(false)}
        >
          <button
            onClick={() => setMega(!megaOpen)}
            onMouseEnter={() => setMega(true)}
            className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-base transition-colors ${
              megaOpen ? "text-foreground bg-surface" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Portfolio
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
          </button>
          {navLinks.map((l) => {
            const isActive = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={() => setMega(false)}
                className={`rounded-md px-3 py-1.5 text-base transition-colors ${
                  isActive ? "text-foreground bg-surface" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <AnimatePresence>
            {megaOpen && <NavMegaMenu onClose={() => setMega(false)} resumeUrl={profileData?.resumeUrl || ""} />}
          </AnimatePresence>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-all hover:bg-surface-2 active:scale-95"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Moon className="h-4 w-4 text-indigo-400" />
              ) : (
                <Sun className="h-4 w-4 text-amber-500" />
              )}
            </button>
          )}
          <div className="hidden md:block">
            <AvailabilityBadge available={profile.available} />
          </div>
          <span className="hidden h-5 w-px bg-border md:block" />
          <Link
            href="/contact"
            className="inline-flex items-center whitespace-nowrap rounded-full border border-border bg-surface px-3.5 py-1.5 text-base font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10"
          >
            Let's talk
          </Link>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-foreground md:hidden"
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>

    {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/70 md:hidden"
              onClick={() => setDrawer(false)}
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed right-0 top-0 z-50 flex h-full w-[86%] max-w-sm flex-col border-l border-border bg-background p-5 md:hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">{profile.handle}</span>
                <button onClick={() => setDrawer(false)} aria-label="Close" className="rounded-md border border-border p-1.5">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-8 space-y-6 overflow-auto">
                <Section 
                  title="Portfolio" 
                  onItemClick={() => setDrawer(false)}
                  links={[
                    { label: "Home", href: "/" },
                    { label: "About", href: "/about" },
                    { label: "Experience", href: "/experience" },
                    { label: "Education", href: "/education" },
                    { label: "Projects", href: "/projects" },
                    { label: "Tech stack", href: "/stack" },
                    { label: "Uses", href: "/uses" },
                  ]} 
                />
                <div className="h-px bg-border" />
                <Section 
                  title="More" 
                  onItemClick={() => setDrawer(false)}
                  links={[
                    { label: "Blog", href: "/blog" },
                    { label: "Services", href: "/services" },
                    { label: "Developer tools", href: "/tools" },
                    { label: "Gallery", href: "/gallery" },
                  ]} 
                />
                <div className="h-px bg-border" />
              </div>

              <button
                onClick={() => {
                  const hasResume = typeof profileData?.resumeUrl === "string" && profileData.resumeUrl.startsWith("http");
                  if (hasResume) {
                    window.open(profileData.resumeUrl, "_blank", "noopener,noreferrer");
                  } else {
                    alert("Resume isn't uploaded yet.");
                  }
                  setDrawer(false);
                }}
                className="mt-6 mb-4 inline-flex items-center gap-1 text-[15px] font-medium text-success hover:text-success/80 text-left bg-transparent border-none cursor-pointer"
              >
                Resume <span className="text-base font-normal">↓</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const Section = ({ 
  title, 
  links, 
  onItemClick 
}: { 
  title: string; 
  links: { label: string; href: string }[]; 
  onItemClick?: () => void;
}) => (
  <div>
    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</div>
    <div className="flex flex-col">
      {links.map((l) => (
        <Link 
          key={l.href} 
          href={l.href} 
          onClick={onItemClick}
          className="rounded-md px-2 py-2 text-base text-foreground/90 hover:bg-surface"
        >
          {l.label}
        </Link>
      ))}
    </div>
  </div>
);
