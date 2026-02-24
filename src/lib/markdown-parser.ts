/**
 * Markdown parser for Cosmic Reach payload markdown files.
 *
 * Parses the custom markdown format into structured sections:
 * - First H1 becomes the hero title
 * - --- becomes section dividers
 * - IMAGE: filename -> image reference
 * - ICON: name -> icon reference
 * - [CTA: text], [Primary CTA: text], [Secondary CTA: text] -> CTA blocks
 * - **bold** -> bold text
 * - **bold** - description -> card-line
 * - Bullet lists (lines starting with bullet character)
 */

export interface MarkdownCTA {
  type: "primary" | "secondary" | "default";
  label: string;
}

export interface MarkdownBlock {
  kind:
    | "heading"
    | "paragraph"
    | "image"
    | "icon"
    | "cta"
    | "list"
    | "bold-line"
    | "card-line";
  level?: number; // for headings: 1, 2, 3
  text?: string;
  src?: string; // for images
  iconName?: string; // for icons
  cta?: MarkdownCTA;
  items?: string[]; // for lists
  cardTitle?: string; // for card-line
  cardDescription?: string; // for card-line
}

export interface MarkdownSection {
  blocks: MarkdownBlock[];
}

export interface ParsedMarkdown {
  sections: MarkdownSection[];
}

function parseLine(line: string): MarkdownBlock | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // IMAGE: filename
  const imageMatch = trimmed.match(/^IMAGE:\s*(.+)$/);
  if (imageMatch) {
    return { kind: "image", src: imageMatch[1].trim() };
  }

  // ICON: name
  const iconMatch = trimmed.match(/^ICON:\s*(.+)$/);
  if (iconMatch) {
    return { kind: "icon", iconName: iconMatch[1].trim() };
  }

  // CTA patterns: [CTA: text], [Primary CTA: text], [Secondary CTA: text]
  const ctaMatch = trimmed.match(
    /^\[(Primary CTA|Secondary CTA|CTA):\s*(.+)\]$/
  );
  if (ctaMatch) {
    const typeStr = ctaMatch[1];
    const label = ctaMatch[2].trim();
    let type: MarkdownCTA["type"] = "default";
    if (typeStr === "Primary CTA") type = "primary";
    else if (typeStr === "Secondary CTA") type = "secondary";
    return { kind: "cta", cta: { type, label } };
  }

  // Bare CTA line: CTA: text
  const bareCta = trimmed.match(/^CTA:\s*(.+)$/);
  if (bareCta) {
    return {
      kind: "cta",
      cta: { type: "default", label: bareCta[1].trim() },
    };
  }

  // Headings
  const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
  if (headingMatch) {
    return {
      kind: "heading",
      level: headingMatch[1].length,
      text: headingMatch[2].trim(),
    };
  }

  // Card-line: **Title** - description (bold with trailing description)
  const cardMatch = trimmed.match(
    /^\*\*(.+?)\*\*\s*[-\u2014]\s+(.+)$/
  );
  if (cardMatch) {
    return {
      kind: "card-line",
      cardTitle: cardMatch[1].trim(),
      cardDescription: cardMatch[2].trim(),
    };
  }

  // Bold standalone line: **text**
  const boldLine = trimmed.match(/^\*\*(.+)\*\*$/);
  if (boldLine) {
    return { kind: "bold-line", text: boldLine[1].trim() };
  }

  return null;
}

export function parseMarkdown(raw: string): ParsedMarkdown {
  const sectionTexts = raw.split(/^---$/m);
  const sections: MarkdownSection[] = [];

  for (const sectionText of sectionTexts) {
    const lines = sectionText.split("\n");
    const blocks: MarkdownBlock[] = [];
    let listItems: string[] = [];
    let lastWasBlank = false;

    const flushList = () => {
      if (listItems.length > 0) {
        blocks.push({ kind: "list", items: [...listItems] });
        listItems = [];
      }
    };

    for (const line of lines) {
      const trimmed = line.trim();

      // Track blank lines to break paragraph merging
      if (!trimmed) {
        lastWasBlank = true;
        if (listItems.length > 0) flushList();
        continue;
      }

      // List items (bullet character or dash, but not bold lines)
      const bulletMatch = trimmed.match(/^[•*]\s+(.+)$/);
      const dashBullet =
        trimmed.match(/^-\s+(.+)$/) && !trimmed.startsWith("**");
      if (bulletMatch && !trimmed.startsWith("**")) {
        listItems.push(bulletMatch[1].trim());
        lastWasBlank = false;
        continue;
      }
      if (dashBullet) {
        const m = trimmed.match(/^-\s+(.+)$/);
        if (m) {
          listItems.push(m[1].trim());
          lastWasBlank = false;
          continue;
        }
      }

      // If we had a list going and this isn't a list item, flush it
      if (listItems.length > 0) {
        flushList();
      }

      const block = parseLine(line);
      if (block) {
        blocks.push(block);
        lastWasBlank = false;
        continue;
      }

      // Regular paragraph text
      if (trimmed) {
        // Append to previous paragraph ONLY if no blank line separated them
        const prevBlock = blocks[blocks.length - 1];
        if (prevBlock?.kind === "paragraph" && !lastWasBlank) {
          prevBlock.text += "\n" + trimmed;
        } else {
          blocks.push({ kind: "paragraph", text: trimmed });
        }
        lastWasBlank = false;
      }
    }

    flushList();

    if (blocks.length > 0) {
      sections.push({ blocks });
    }
  }

  return { sections };
}

/**
 * Extract the first H1 from parsed markdown (hero title).
 */
export function extractHeroTitle(parsed: ParsedMarkdown): string | null {
  for (const section of parsed.sections) {
    for (const block of section.blocks) {
      if (block.kind === "heading" && block.level === 1) {
        return block.text ?? null;
      }
    }
  }
  return null;
}

/**
 * Extract the subtitle (first paragraph after H1 in section 0).
 */
export function extractHeroSubtitle(parsed: ParsedMarkdown): string | null {
  if (parsed.sections.length === 0) return null;
  const firstSection = parsed.sections[0];
  let foundH1 = false;
  for (const block of firstSection.blocks) {
    if (block.kind === "heading" && block.level === 1) {
      foundH1 = true;
      continue;
    }
    if (foundH1 && block.kind === "paragraph") {
      return block.text ?? null;
    }
  }
  return null;
}
