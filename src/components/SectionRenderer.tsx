import Image from "next/image";
import { Icon } from "./Icon";
import { CTAButton } from "./CTAButton";
import type { MarkdownSection, MarkdownBlock } from "@/lib/markdown-parser";

interface SectionRendererProps {
  section: MarkdownSection;
  index: number;
  isHero?: boolean;
}

function renderInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const boldMatch = part.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={i} className="font-semibold text-starlight">
          {boldMatch[1]}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function renderParagraph(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {renderInlineMarkdown(line)}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}

function resolveImageSrc(src: string): string {
  if (src.startsWith("/")) return src;
  if (src.startsWith("founder/")) return `/images/${src}`;
  return `/images/${src}`;
}

function isFounderImage(src: string): boolean {
  return src.includes("founder/") || src.includes("founder%2F");
}

function HeroSection({ section }: { section: MarkdownSection }) {
  const heading = section.blocks.find(
    (b) => b.kind === "heading" && b.level === 1
  );
  const paragraphs = section.blocks.filter((b) => b.kind === "paragraph");
  const ctas = section.blocks.filter((b) => b.kind === "cta");
  const image = section.blocks.find((b) => b.kind === "image");

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      {image?.src && (
        <div className="absolute inset-0">
          <Image
            src={resolveImageSrc(image.src)}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/85 via-deep-space/75 to-deep-space" />
        </div>
      )}

      <div className="relative mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 text-center">
        <div className="max-w-2xl mx-auto">
          {heading?.text && (
            <h1 id="hero-title" className="mb-3 text-copper" style={{ textWrap: "balance" }}>
              {heading.text}
            </h1>
          )}
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-starlight/80 text-base sm:text-lg mb-3"
            >
              {renderParagraph(p.text ?? "")}
            </p>
          ))}
          {ctas.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {ctas.map((c, i) => (
                <CTAButton
                  key={i}
                  label={c.cta!.label}
                  variant={
                    c.cta!.type === "secondary"
                      ? "secondary"
                      : i === 0
                        ? "primary"
                        : "secondary"
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

interface FrameworkCard {
  title: string;
  description?: string;
  iconName?: string;
}

function buildFrameworkCards(blocks: MarkdownBlock[]): FrameworkCard[] {
  const cards: FrameworkCard[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (block.kind === "card-line") {
      const card: FrameworkCard = {
        title: block.cardTitle ?? "",
        description: block.cardDescription,
      };
      for (let j = i + 1; j < Math.min(i + 3, blocks.length); j++) {
        if (blocks[j].kind === "icon") {
          card.iconName = blocks[j].iconName;
          break;
        }
      }
      cards.push(card);
      continue;
    }

    if (block.kind === "bold-line" && block.text) {
      const card: FrameworkCard = { title: block.text };
      if (block.text.includes(" \u2014 ")) {
        const [title, desc] = block.text.split(" \u2014 ");
        card.title = title;
        card.description = desc;
      } else if (block.text.includes(" - ")) {
        const dashIdx = block.text.indexOf(" - ");
        card.title = block.text.slice(0, dashIdx);
        card.description = block.text.slice(dashIdx + 3);
      }
      for (let j = i + 1; j < Math.min(i + 3, blocks.length); j++) {
        if (blocks[j].kind === "icon") {
          card.iconName = blocks[j].iconName;
          break;
        }
      }
      cards.push(card);
      continue;
    }

    if (block.kind === "paragraph" && block.text) {
      const boldMatch = block.text.match(
        /^\*\*(.+?)\*\*\s*[-\u2014]\s+(.+)$/
      );
      if (boldMatch) {
        const card: FrameworkCard = {
          title: boldMatch[1],
          description: boldMatch[2],
        };
        for (let j = i + 1; j < Math.min(i + 3, blocks.length); j++) {
          if (blocks[j].kind === "icon") {
            card.iconName = blocks[j].iconName;
            break;
          }
        }
        cards.push(card);
      }
    }
  }
  return cards;
}

function ContentSection({
  section,
  index,
}: {
  section: MarkdownSection;
  index: number;
}) {
  const heading = section.blocks.find((b) => b.kind === "heading");
  const paragraphs = section.blocks.filter((b) => b.kind === "paragraph");
  const icons = section.blocks.filter((b) => b.kind === "icon");
  const ctas = section.blocks.filter((b) => b.kind === "cta");
  const images = section.blocks.filter((b) => b.kind === "image");
  const lists = section.blocks.filter((b) => b.kind === "list");

  const frameworkCards = buildFrameworkCards(section.blocks);
  const hasCards = frameworkCards.length >= 2;

  // Only show the founder image, skip all other content images
  const founderImage = images.find((img) => isFounderImage(img.src ?? ""));

  return (
    <section
      className="py-10 sm:py-16"
      aria-labelledby={heading?.text ? `section-${index}` : undefined}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
        {/* Everything centered */}
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon above heading — use section icon if defined, otherwise spark */}
          {heading?.text && (
            <div className="mb-3">
              <Icon
                name={icons.length > 0 && !hasCards ? icons[0].iconName! : "spark"}
                size={36}
                className="opacity-80 mx-auto"
              />
            </div>
          )}

          {/* Heading */}
          {heading?.text && (
            <HeadingTag
              level={(heading.level ?? 2) as 1 | 2 | 3}
              id={`section-${index}`}
              className="mb-3"
            >
              {heading.text}
            </HeadingTag>
          )}

          {/* Paragraphs */}
          {paragraphs.map((p, i) => (
            <p key={i} className="text-starlight/70 text-base mb-3">
              {renderParagraph(p.text ?? "")}
            </p>
          ))}

          {/* Lists */}
          {lists.map((l, i) => (
            <ul
              key={i}
              className="space-y-2 mb-3 text-left inline-block"
            >
              {l.items!.map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-starlight/70 text-base"
                >
                  <span
                    className="text-copper mt-1.5 text-xs"
                    aria-hidden="true"
                  >
                    &#9670;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>

        {/* Framework cards - outside the max-w-2xl to use full width */}
        {hasCards && (
          <div className={`grid gap-4 mt-6 ${
            frameworkCards.length === 3
              ? "sm:grid-cols-3"
              : "sm:grid-cols-2"
          }`}>
            {frameworkCards.map((card, i) => (
              <div
                key={i}
                className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-5 text-center transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30 hover:shadow-subtle"
              >
                {card.iconName && (
                  <Icon
                    name={card.iconName}
                    size={26}
                    className="mb-2 opacity-70 mx-auto"
                  />
                )}
                <h3 className="font-display font-semibold text-base mb-1">
                  {card.title}
                </h3>
                {card.description && (
                  <p className="text-sm text-starlight/60">
                    {card.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Founder image only - centered and contained */}
        {founderImage && (
          <div className="mt-8 flex justify-center">
            <div className="relative w-full aspect-[3/4] max-w-[240px] sm:max-w-[280px] rounded-[var(--radius-lg)] overflow-hidden">
              <Image
                src={resolveImageSrc(founderImage.src!)}
                alt=""
                fill
                className="object-cover"
                sizes="280px"
              />
            </div>
          </div>
        )}

        {/* CTAs - centered */}
        {ctas.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {ctas.map((c, i) => (
              <CTAButton
                key={i}
                label={c.cta!.label}
                variant={i === 0 ? "primary" : "secondary"}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function HeadingTag({
  level,
  id,
  className,
  children,
}: {
  level: 1 | 2 | 3;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (level === 1) return <h1 id={id} className={className}>{children}</h1>;
  if (level === 3) return <h3 id={id} className={className}>{children}</h3>;
  return <h2 id={id} className={className}>{children}</h2>;
}

export function SectionRenderer({
  section,
  index,
  isHero,
}: SectionRendererProps) {
  if (isHero) {
    return <HeroSection section={section} />;
  }
  return <ContentSection section={section} index={index} />;
}
