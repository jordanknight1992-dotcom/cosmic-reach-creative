# Brand Tokens

Complete design token reference for Cosmic Reach Creative.

## Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `deep-space` | `#0B1120` | Primary background. The dominant surface |
| `surface` | `#111827` | Secondary surfaces, cards, elevated areas |
| `surface-elevated` | `#1a2332` | Hover states on cards |
| `starlight` | `#E8DFCF` | Primary text. Warm off-white |
| `copper` | `#D4A574` | Secondary accent. Labels, metadata |
| `spark-red` | `#E04747` | Action color. CTAs, signals, alerts. Use sparingly |
| `brand-navy-alt` | `#0B1628` | Alternative dark background for section variation |
| `muted` | `#8896AB` | Secondary text, descriptions |
| `border` | `#1e293b` | Borders and dividers |

### Color Rules

- Dark-first. Deep navy is dominant
- Red is functional signal only. Never decorative
- No random gradients
- No neon or sci-fi visuals

## Typography

### Display Font: Space Grotesk

Used for headings, buttons, labels, and navigation.

| Weight | CSS | Usage |
|--------|-----|-------|
| 600 | `font-semibold` | Subheadings, buttons, nav links |
| 700 | `font-bold` | Primary headings |

### Body Font: Inter

Used for body text, descriptions, and form content.

| Weight | CSS | Usage |
|--------|-----|-------|
| 400 | `font-normal` | Body text |
| 500 | `font-medium` | Emphasized body text |

### Type Scale

| Element | Mobile | Desktop | Weight |
|---------|--------|---------|--------|
| H1 (Hero) | `text-4xl` (36px) | `text-7xl` (72px) | 700 |
| H2 (Section) | `text-3xl` (30px) | `text-5xl` (48px) | 700 |
| H3 (Card title) | `text-xl` (20px) | `text-xl` (20px) | 700 |
| Body large | `text-lg` (18px) | `text-lg` (18px) | 400 |
| Body | `text-base` (16px) | `text-base` (16px) | 400 |
| Small / Labels | `text-sm` (14px) | `text-sm` (14px) | 600 |
| Caption | `text-xs` (12px) | `text-xs` (12px) | 600 |

## Spacing

Based on 4px grid.

| Token | Pixels | Tailwind |
|-------|--------|----------|
| xs | 4px | `p-1` |
| sm | 8px | `p-2` |
| md | 16px | `p-4` |
| lg | 24px | `p-6` |
| xl | 32px | `p-8` |
| 2xl | 48px | `p-12` |
| 3xl | 64px | `p-16` |
| 4xl | 96px | `p-24` |

## Border Radius

| Token | Pixels | CSS Variable |
|-------|--------|-------------|
| sm | 10px | `var(--radius-sm)` |
| md | 14px | `var(--radius-md)` |
| lg | 18px | `var(--radius-lg)` |

## Motion

| Token | Duration | Usage |
|-------|----------|-------|
| fast | 180ms | Micro-interactions (hover states) |
| base | 240ms | Standard transitions |
| slow | 300ms | Page-level transitions |

**Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (Tailwind: `ease-cosmic`)

**Reduced motion:** All animations respect `prefers-reduced-motion: reduce`.

## Layout

| Property | Value |
|----------|-------|
| Max width | 1200px |
| Grid (desktop) | 12 columns |
| Grid (tablet) | 8 columns |
| Grid (mobile) | 4 columns |
| Container padding | 20px (mobile), 32px (desktop) |

## Chevron Motif

- Used as directional indicator on CTAs
- Functional only, never decorative
- SVG at 16px default size
- Inherits current text color

## Breakpoints

| Name | Width | Tailwind |
|------|-------|----------|
| Mobile | 0px | Default |
| Tablet | 768px | `md:` |
| Desktop | 1024px | `lg:` |

## Accessibility

- WCAG 2.1 AA minimum for all text
- Focus states: 2px solid spark-red with 2px offset
- All interactive elements are keyboard accessible
- Reduced motion respected globally
- Color never conveys information alone
