import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "@/services/portfolio-service";
import { ProjectCard } from "@/components/ProjectCard";
import { projects as mockProjects } from "@/data/mock";
import { ProjectDetailsCarousel } from "@/components/ProjectDetailsCarousel";
import { ExternalLink } from "lucide-react";

const Github = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4" />
  </svg>
);

export default async function ProjectDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let project: any;
  try {
    project = await getProjectBySlug(slug);
  } catch (err) {
    // Check mock projects
    project = mockProjects.find((p) => p.slug === slug);
    if (project) {
        // Map mock to UI shape
        project = {
            ...project,
            techStack: project.stack,
            githubUrl: project.github,
            liveUrl: project.live
        };
    } else {
      notFound();
    }
  }
  
  const allProjects = await getProjects().catch(() => []);
  const more = allProjects.filter((p: any) => p.slug !== slug).slice(0, 3);

  const projectImages = Array.from(
    new Set([
      ...(project.imageUrl ? [project.imageUrl] : []),
      ...(project.images || [])
    ].filter((url): url is string => Boolean(url)))
  );

  return (
    <div className="container-page pt-16 pb-24">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">← Back to projects</Link>
        
        <div className="flex items-center gap-4">
            {project.githubUrl && (
                <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2 transition-colors"
                >
                    <Github size={16} /> Source Code
                </a>
            )}
            {project.liveUrl && (
                <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <ExternalLink size={16} /> Live Demo
                </a>
            )}
        </div>
      </div>
      
      <div className="grid gap-12 lg:grid-cols-5 items-start">
        {/* Left Column: Carousel and Stack (Sticky on Desktop) */}
        <div className="lg:col-span-3 space-y-8 lg:sticky lg:top-24">
            <ProjectDetailsCarousel images={projectImages} />
            
            <div>
                <h3 className="text-lg font-semibold mb-4">Technologies used</h3>
                <div className="flex flex-wrap gap-2">
                    {project.techStack?.map((s: string) => (
                        <span key={s} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground">
                            {s}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column: Info */}
        <div className="lg:col-span-2 space-y-8">
            <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">{project.category}</span>
                <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-foreground">{project.title}</h1>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                    {project.description}
                </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface/50 p-6 space-y-4">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium">Lead Developer</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Timeline</span>
                    <span className="font-medium">2024 — Present</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                        Active
                    </span>
                </div>
            </div>

            <div className="prose prose-invert prose-sm">
                <p>
                    This project was built to address the scalability issues in modern event-driven architectures. 
                    Leveraging the power of Next.js for the frontend and NestJS for the robust backend pipelines.
                </p>
                {/* Additional project details could go here */}
            </div>
        </div>
      </div>

      {/* Suggested Projects */}
      <div className="mt-24">
        <h3 className="mb-8 font-display text-2xl font-semibold tracking-tight">Explore more projects</h3>
        <div className="grid gap-6 md:grid-cols-3">
            {more.map((p: any) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </div>
    </div>
  );
}
