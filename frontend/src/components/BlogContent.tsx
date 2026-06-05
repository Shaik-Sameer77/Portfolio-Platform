"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface BlogContentProps {
  html: string;
  className?: string;
}

export default function BlogContent({ html, className }: BlogContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        primaryColor: "#7c6af7",
        primaryTextColor: "#e0e0e0",
        primaryBorderColor: "#5a4fcf",
        lineColor: "#888",
        secondaryColor: "#1e1e2e",
        tertiaryColor: "#2a2a3e",
        background: "#141420",
        mainBkg: "#1e1e2e",
        nodeBorder: "#5a4fcf",
        clusterBkg: "#1e1e2e",
        titleColor: "#e0e0e0",
        edgeLabelBackground: "#1e1e2e",
      },
    });
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const renderMermaid = async () => {
      const container = ref.current;
      if (!container) return;

      // Find all <pre><code class="language-mermaid"> blocks
      const mermaidBlocks = container.querySelectorAll(
        "pre code.language-mermaid"
      );

      for (let i = 0; i < mermaidBlocks.length; i++) {
        const codeEl = mermaidBlocks[i];
        const preEl = codeEl.parentElement;
        if (!preEl) continue;

        const code = codeEl.textContent || "";
        const id = `mermaid-blog-${Date.now()}-${i}`;

        try {
          const { svg } = await mermaid.render(id, code);
          const wrapper = document.createElement("div");
          wrapper.innerHTML = svg;
          wrapper.className = "mermaid-rendered";
          wrapper.style.display = "flex";
          wrapper.style.justifyContent = "center";
          wrapper.style.margin = "2.5rem 0";
          wrapper.style.padding = "1.5rem";
          wrapper.style.borderRadius = "16px";
          wrapper.style.border = "1px solid rgba(124, 106, 247, 0.2)";
          wrapper.style.background =
            "linear-gradient(135deg, rgba(30,30,46,0.8), rgba(20,20,32,0.9))";

          preEl.parentNode?.replaceChild(wrapper, preEl);
        } catch (e) {
          console.error("Mermaid render error:", e);
        }
      }
    };

    // Small delay to ensure DOM is fully painted
    const timeout = setTimeout(renderMermaid, 100);
    return () => clearTimeout(timeout);
  }, [html]);

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
