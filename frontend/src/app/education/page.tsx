"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { education as mockEducation, certifications as mockCertifications } from "@/data/mock";
import { getEducation, getCertifications, type Education as ApiEducation, type Certification } from "@/services/portfolio-service";
import { DevLoader } from "@/components/DevLoader";

export default function Education() {
  const [eduData, setEduData] = useState<ApiEducation[] | null>(null);
  const [certData, setCertData] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [edu, certs] = await Promise.all([
          getEducation(),
          getCertifications()
        ]);
        if (edu && edu.length > 0) setEduData(edu);
        if (certs) setCertData(certs);
      } catch (err) {
        console.warn("Failed to fetch education/certification data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeEducation = eduData || mockEducation.map((e, idx) => ({
    id: idx + 1,
    institution: e.school,
    degree: e.degree,
    startYear: e.startYear,
    endYear: e.endYear,
  }));

  if (loading) {
    return <DevLoader fullScreen={false} />;
  }

  return (
    <>
      <PageHeader eyebrow="Education" title="Degrees and certs." />
      <div className="container-page pb-24">
        
        <div className="mb-12">
          <h2 className="mb-6 font-display text-2xl font-semibold">Academic Background</h2>
          <div className="space-y-4">
            {activeEducation.map((e: any) => (
              <div key={e.id} className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-6 md:flex-row md:items-baseline md:justify-between">
                <div>
                  <div className="font-display text-xl font-semibold">{e.institution}</div>
                  <div className="text-sm text-muted-foreground">{e.degree}</div>
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  {e.endYear ? `${e.startYear} — ${e.endYear}` : `${e.startYear} — Present`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {(certData.length > 0 || mockCertifications.length > 0) && (
          <div>
            <h2 className="mb-6 font-display text-2xl font-semibold">Certifications</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {(certData.length > 0 ? certData : mockCertifications.map((c, idx) => ({ id: idx, ...c, order: idx }))).map((c: any) => (
                <div key={c.id} className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-6">
                  <div>
                    <div className="font-display text-lg font-semibold">{c.name}</div>
                    <div className="text-sm text-muted-foreground">{c.issuer}</div>
                  </div>
                  {c.imageUrl && (
                    <div className="mt-2 relative w-full h-40 overflow-hidden rounded-lg border border-border">
                      <Image src={c.imageUrl} alt={c.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                    </div>
                  )}
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="font-mono text-xs text-muted-foreground">{c.date || "No date"}</div>
                    {c.imageUrl && (
                      <a href={c.imageUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary hover:underline">
                        View Full Image →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
