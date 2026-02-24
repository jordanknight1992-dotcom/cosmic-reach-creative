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

/**
 * Build framework cards from bold-line / card-line blocks.
 * Skips bold-lines ending with ":" — those are labels (e.g. "Clients get:").
 */
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
      // Skip label bold-lines (e.g. "Clients get:", "Framework coverage:")
      if (block.text.endsWith(":")) continue;

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

/**
 * Given the blocks of a section that has h3 sub-headings (sprint tiers),
 * group them into: { preBlocks, tiers: [{ heading, blocks }] }.
 */
interface TierGroup {
  heading: MarkdownBlock;
  blocks: MarkdownBlock[];
}

function groupBySubHeadings(blocks: MarkdownBlock[]): {
  preBlocks: MarkdownBlock[];
  tiers: TierGroup[];
} {
  const preBlocks: MarkdownBlock[] = [];
  const tiers: TierGroup[] = [];
  let current: TierGroup | null = null;

  for (const block of blocks) {
    if (block.kind === "heading" && block.level === 3) {
      if (current) tiers.push(current);
      current = { heading: block, blocks: [] };
      continue;
    }
    if (current) {
      current.blocks.push(block);
    } else {
      preBlocks.push(block);
    }
  }
  if (current) tiers.push(current);

  return { preBlocks, tiers };
}

/**
 * A bold-label (e.g. "Clients get:") paired with its following list,
 * to be rendered as a centered framed card.
 */
interface LabelCardItem {
  kind: "label-card";
  label: string;
  list: MarkdownBlock;
}
type FlowItem = MarkdownBlock | LabelCardItem;

function isLabelCard(item: FlowItem): item is LabelCardItem {
  return (item as LabelCardItem).kind === "label-card";
}

/**
 * Scan flowBlocks and group consecutive bold-label + list pairs into
 * LabelCardItem so they render as a single framed card.
 */
function groupLabelListPairs(blocks: MarkdownBlock[]): FlowItem[] {
  const result: FlowItem[] = [];
  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];
    if (
      block.kind === "bold-line" &&
      block.text?.endsWith(":") &&
      i + 1 < blocks.length &&
      blocks[i + 1].kind === "list"
    ) {
      result.push({ kind: "label-card", label: block.text, list: blocks[i + 1] });
      i += 2;
    } else {
      result.push(block);
      i++;
    }
  }
  return result;
}

/**
 * Render a label + bullet list as a centered framed outcome/deliverable card.
 */
function renderOutcomeCard(label: string, list: MarkdownBlock, key: number | string) {
  return (
    <div
      key={key}
      className="mt-6 mx-auto w-full rounded-2xl border border-starlight/10 bg-navy/50 p-8 text-center transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30 hover:shadow-subtle"
    >
      <h4 className="font-display font-semibold text-copper text-sm uppercase tracking-widest mb-5">
        {label}
      </h4>
      <ul className="space-y-3">
        {list.items!.map((item, j) => (
          <li key={j} className="text-starlight/70 text-base">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Render a bullet list with consistent alignment.
 */
function renderList(list: MarkdownBlock, key: number | string) {
  return (
    <ul key={key} className="mt-2 mx-auto w-fit text-left space-y-3">
      {list.items!.map((item, j) => (
        <li
          key={j}
          className="flex items-start gap-3 text-starlight/70 text-base"
        >
          <span
            className="text-copper mt-2 text-xs shrink-0"
            aria-hidden="true"
          >
            &#9670;
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Render a sprint tier as a structured block with optional 2-column cards
 * for "Clients get:" / "Framework coverage:" pairs.
 */
function renderSprintTier(tier: TierGroup, tierIdx: number) {
  const paragraphs = tier.blocks.filter((b) => b.kind === "paragraph");
  const icon = tier.blocks.find((b) => b.kind === "icon");
  const ctas = tier.blocks.filter((b) => b.kind === "cta");

  // Group bold-line labels with their following lists into card pairs
  const cards: { label: string; items: string[] }[] = [];
  for (let i = 0; i < tier.blocks.length; i++) {
    const block = tier.blocks[i];
    if (block.kind === "bold-line" && block.text?.endsWith(":")) {
      // Look for the next list block
      const nextList = tier.blocks
        .slice(i + 1)
        .find((b) => b.kind === "list");
      cards.push({
        label: block.text,
        items: nextList?.items ?? [],
      });
    }
  }

  return (
    <div key={tierIdx} className="mt-10 pt-10 border-t border-starlight/8 first:border-0 first:pt-0">
      {/* Tier header row: icon + heading */}
      <div className="flex items-center justify-center gap-3 mb-4">
        {icon?.iconName && (
          <Icon name={icon.iconName} size={28} className="opacity-70 shrink-0" />
        )}
        <h3 className="font-display font-semibold text-xl">{tier.heading.text}</h3>
      </div>

      {/* Description paragraphs */}
      {paragraphs.map((p, i) => (
        <p key={i} className="text-starlight/70 text-base mb-3 text-center max-w-2xl mx-auto">
          {renderParagraph(p.text ?? "")}
        </p>
      ))}

      {/* Deliverable cards in 2-column grid */}
      {cards.length > 0 && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {cards.map((card, i) => (
            <div
              key={i}
              className="rounded-2xl border border-starlight/10 bg-navy/50 p-8 transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30 hover:shadow-subtle"
            >
              <h4 className="font-display font-semibold text-base text-copper mb-4">
                {card.label}
              </h4>
              <ul className="space-y-3">
                {card.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-starlight/70 text-sm"
                  >
                    <span
                      className="text-copper mt-1.5 text-xs shrink-0"
                      aria-hidden="true"
                    >
                      &#9670;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* CTAs */}
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
  );
}

function ContentSection({
  section,
  index,
}: {
  section: MarkdownSection;
  index: number;
}) {
  const allBlocks = section.blocks;
  const heading = allBlocks.find(
    (b) => b.kind === "heading" && (b.level === 1 || b.level === 2)
  );
  const icons = allBlocks.filter((b) => b.kind === "icon");
  const ctas = allBlocks.filter((b) => b.kind === "cta");
  const images = allBlocks.filter((b) => b.kind === "image");
  const hasSubHeadings = allBlocks.some(
    (b) => b.kind === "heading" && b.level === 3
  );

  const frameworkCards = buildFrameworkCards(allBlocks);
  const hasCards = frameworkCards.length >= 2;

  // Track which block indices are consumed by framework cards
  const cardConsumedIndices = new Set<number>();
  if (hasCards) {
    for (let i = 0; i < allBlocks.length; i++) {
      const block = allBlocks[i];
      const isCardBlock =
        block.kind === "card-line" ||
        (block.kind === "bold-line" &&
          block.text &&
          !block.text.endsWith(":"));
      if (isCardBlock) {
        cardConsumedIndices.add(i);
        for (let j = i + 1; j < Math.min(i + 3, allBlocks.length); j++) {
          if (allBlocks[j].kind === "icon") {
            cardConsumedIndices.add(j);
            break;
          }
        }
      }
    }
  }

  // Founder image
  const founderImage = images.find((img) => isFounderImage(img.src ?? ""));

  // Flow blocks: everything except heading, CTAs, images, card-consumed, and h3 sub-heading content
  const flowBlocks = allBlocks.filter((b, i) => {
    if (b === heading) return false;
    if (b.kind === "cta") return false;
    if (b.kind === "image") return false;
    if (cardConsumedIndices.has(i)) return false;
    // h3 headings and their content are handled by the sprint tier renderer
    if (hasSubHeadings && b.kind === "heading" && b.level === 3) return false;
    return true;
  });

  // For sections with sub-headings, separate pre-h3 blocks from tier blocks
  const { preBlocks, tiers } = hasSubHeadings
    ? groupBySubHeadings(
        allBlocks.filter((b) => b !== heading && b.kind !== "image")
      )
    : { preBlocks: [], tiers: [] };

  // Determine the icon to show above the h2 heading
  const sectionIconName =
    icons.length > 0 && !hasCards && !hasSubHeadings
      ? icons[0].iconName!
      : "spark";

  return (
    <section
      className="py-10 sm:py-16"
      aria-labelledby={heading?.text ? `section-${index}` : undefined}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
        {/* Centered text column */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Icon above heading */}
          {heading?.text && (
            <div className="mb-3">
              <Icon
                name={sectionIconName}
                size={36}
                className="opacity-80 mx-auto"
              />
            </div>
          )}

          {/* Heading — h2s with ": " get a split two-line treatment */}
          {heading?.text && (() => {
            const level = (heading.level ?? 2) as 1 | 2 | 3;
            const colonIdx = level === 2 ? heading.text.indexOf(": ") : -1;
            if (colonIdx > -1) {
              const label = heading.text.slice(0, colonIdx);
              const subtitle = heading.text.slice(colonIdx + 2);
              return (
                <h2 id={`section-${index}`} className="mb-3">
                  <span className="block text-copper">{label}</span>
                  <span className="block">{subtitle}</span>
                </h2>
              );
            }
            return (
              <HeadingTag
                level={level}
                id={`section-${index}`}
                className="mb-3"
              >
                {heading.text}
              </HeadingTag>
            );
          })()}

          {/* Flow blocks rendered in document order.
              Bold-label + list pairs become centered framed outcome cards. */}
          {!hasSubHeadings &&
            groupLabelListPairs(flowBlocks).map((item, i) => {
              if (isLabelCard(item)) {
                return renderOutcomeCard(item.label, item.list, i);
              }
              const block = item as MarkdownBlock;
              if (block.kind === "paragraph") {
                return (
                  <p key={i} className="text-starlight/70 text-base mb-3">
                    {renderParagraph(block.text ?? "")}
                  </p>
                );
              }
              if (block.kind === "bold-line") {
                return (
                  <p
                    key={i}
                    className="font-display font-semibold text-starlight mt-6 mb-2"
                  >
                    {block.text}
                  </p>
                );
              }
              if (block.kind === "list") {
                return renderList(block, i);
              }
              // Icons in flow are section markers already handled above
              if (block.kind === "icon") return null;
              return null;
            })}

          {/* Pre-h3 content for sections with sub-headings */}
          {hasSubHeadings &&
            preBlocks.map((block, i) => {
              if (block.kind === "paragraph") {
                return (
                  <p key={i} className="text-starlight/70 text-base mb-3">
                    {renderParagraph(block.text ?? "")}
                  </p>
                );
              }
              if (block.kind === "bold-line") {
                return (
                  <p
                    key={i}
                    className="font-display font-semibold text-starlight mt-6 mb-2"
                  >
                    {block.text}
                  </p>
                );
              }
              if (block.kind === "list") {
                return renderList(block, i);
              }
              return null;
            })}
        </div>

        {/* Sprint tiers (sections with h3 sub-headings) */}
        {hasSubHeadings && tiers.length > 0 && (
          <div className="mx-auto max-w-5xl mt-8">
            {tiers.map((tier, i) => renderSprintTier(tier, i))}
          </div>
        )}

        {/* Framework cards — outside the text column for full width */}
        {hasCards && (
          <div
            className={`grid gap-4 mt-6 ${
              frameworkCards.length === 3
                ? "sm:grid-cols-3"
                : "sm:grid-cols-2"
            }`}
          >
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

        {/* Founder image only — centered and contained */}
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

        {/* CTAs — centered (only for non-sub-heading sections) */}
        {!hasSubHeadings && ctas.length > 0 && (
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
  if (level === 1)
    return (
      <h1 id={id} className={className}>
        {children}
      </h1>
    );
  if (level === 3)
    return (
      <h3 id={id} className={className}>
        {children}
      </h3>
    );
  return (
    <h2 id={id} className={className}>
      {children}
    </h2>
  );
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
