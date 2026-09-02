"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { profile } from "@/data/mock";
import { getSocialLinks, type SocialLinks } from "@/services/portfolio-service";

const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path></svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const TwitterX = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
);

export const Footer = () => {
  const [socials, setSocials] = useState<SocialLinks | null>(null);

  useEffect(() => {
    getSocialLinks()
      .then((data) => setSocials(data))
      .catch((err) => console.warn("Failed to fetch social links in Footer:", err));
  }, []);

  const github = socials?.github || profile.github;
  const linkedin = socials?.linkedin || profile.linkedin;
  const twitter = socials?.twitter;
  const email = socials?.email || profile.email;

  return (
    <footer className="border-t border-border mt-24">
      <div className="container-page py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold">{profile.handle}</div>
          <div className="text-xs text-muted-foreground mt-1">© {new Date().getFullYear()} {profile.name}. Built from scratch.</div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/projects" className="hover:text-foreground">Projects</Link>
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <Link href="/uses" className="hover:text-foreground">Uses</Link>
          <Link href="/contact" className="hover:text-foreground">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          {github && (
            <a href={github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {twitter && (
            <a href={twitter} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="Twitter">
              <TwitterX className="h-4 w-4" />
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="text-muted-foreground hover:text-foreground" aria-label="Email">
              <Mail className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

