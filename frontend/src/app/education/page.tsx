"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { education as mockEducation } from "@/data/mock";
import { getEducation, getCertifications, type Education as ApiEducation, type Certification } from "@/services/portfolio-service";

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

  const activeEducation = eduData || mockEducation.map(e => ({
    id: Math.random(),
    institution: e.school,
    degree: e.degree,
    startYear: 0,
    endYear: 0,
    // Just a hacky way to map mock date to UI since mock has strings like '2018 - 2022'
    _mockDate: e.date 
  }));

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
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
                  {e._mockDate ? e._mockDate : (e.endYear ? `${e.startYear} — ${e.endYear}` : `${e.startYear} — Present`)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {certData.length > 0 && (
          <div>
            <h2 className="mb-6 font-display text-2xl font-semibold">Certifications</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {certData.map((c) => (
                <div key={c.id} className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-6">
                  <div>
                    <div className="font-display text-lg font-semibold">{c.name}</div>
                    <div className="text-sm text-muted-foreground">{c.issuer}</div>
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="font-mono text-xs text-muted-foreground">{c.date || "No date"}</div>
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary hover:underline">
                        View Credential →
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
