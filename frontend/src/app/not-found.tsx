import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function NotFound() {
  return (
    <>
      <PageHeader eyebrow="404" title="Page not found." subtitle="The page you are looking for doesn't exist or has been moved." />
      <div className="container-page pb-24">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/50">
          Return Home
        </Link>
      </div>
    </>
  );
}
