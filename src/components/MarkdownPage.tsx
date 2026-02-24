import { parseMarkdown } from "@/lib/markdown-parser";
import { SectionRenderer } from "./SectionRenderer";

interface MarkdownPageProps {
  content: string;
}

export function MarkdownPage({ content }: MarkdownPageProps) {
  const parsed = parseMarkdown(content);

  return (
    <main id="main-content">
      {parsed.sections.map((section, i) => (
        <div key={i}>
          <SectionRenderer
            section={section}
            index={i}
            isHero={i === 0}
          />
          {/* Thin line divider between sections (not after hero, not after last) */}
          {i > 0 && i < parsed.sections.length - 1 && (
            <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
              <hr className="border-t border-starlight/8" />
            </div>
          )}
        </div>
      ))}
    </main>
  );
}
