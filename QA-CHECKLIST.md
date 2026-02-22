# Cosmic Reach Creative - QA Checklist

## Routes and Content

- [ ] `/` renders homepage with hero image, verbatim markdown copy
- [ ] `/approach` renders with hero image and Signal Framework content
- [ ] `/work` renders with hero image, Milestone and Clear Enough listings
- [ ] `/work/milestone` renders case study with title block (no hero image)
- [ ] `/work/clear-enough` renders case study with title block (no hero image)
- [ ] `/labs` renders with hero image and Systems Currently in Orbit
- [ ] `/about` renders with hero image and What We Hold Constant
- [ ] `/signal-session` renders with hero image and intake form
- [ ] `/contact` renders with hero image and contact form

## Navigation

- [ ] Header contains: Home, Approach, Work, Labs, About, Signal Session, Contact
- [ ] Header CTA: "Start a Signal Session" links to /signal-session
- [ ] Mobile menu opens and closes correctly
- [ ] Active nav link is highlighted
- [ ] Logo in header links to homepage

## Floating CTA

- [ ] Appears after scrolling 400px
- [ ] Label: "Start a Signal Session" (collapsed: "Signal Session" on mobile)
- [ ] Links to /signal-session
- [ ] Hidden on /signal-session page
- [ ] Keyboard focusable with visible focus state
- [ ] Does not overlap content on mobile
- [ ] Has aria-label

## Typography

- [ ] H1/H2/H3 use Space Grotesk
- [ ] Body text uses Inter
- [ ] Font weights match: headings 500-700, body 400-600
- [ ] No raw markdown output anywhere

## Color System

- [ ] Base: deep navy (#0B1120)
- [ ] Text: starlight (#E8DFCF)
- [ ] Accent: copper (#D4A574) used sparingly
- [ ] Red (#E04747) used for action/attention only
- [ ] No colors outside the design token palette

## Spacing and Layout

- [ ] Max content width: 1200px
- [ ] Consistent section padding (py-16 md:py-24)
- [ ] Breathable layout, no cramped sections
- [ ] Reading line length controlled (max-w-3xl for prose)

## Motion

- [ ] Transitions use cubic-bezier(0.16, 1, 0.3, 1)
- [ ] Only subtle fades, lifts, hover effects
- [ ] prefers-reduced-motion disables all animations

## Logo Usage

- [ ] Logo appears in header
- [ ] Logo appears in footer
- [ ] Brand icon appears in footer
- [ ] Logo geometry and colors unaltered

## Hero Images

- [ ] Home page has hero image
- [ ] Approach page has hero image
- [ ] Work page has hero image
- [ ] About page has hero image
- [ ] Signal Session page has hero image
- [ ] Labs page has hero image
- [ ] Contact page has hero image
- [ ] Case studies do NOT have hero images (title block only)

## SEO and Metadata

- [ ] Each page has unique title
- [ ] Each page has description
- [ ] Canonical URLs present
- [ ] Open Graph tags present with images
- [ ] Twitter card tags present
- [ ] /sitemap.xml generates correctly (all 9 routes)
- [ ] /robots.txt generates correctly
- [ ] JSON-LD Organization schema on homepage
- [ ] JSON-LD WebSite schema on homepage

## Favicon

- [ ] favicon.ico present (brand icon)
- [ ] icon.svg present (brand icon)
- [ ] apple-icon.png present

## Accessibility

- [ ] Skip to content link present and functional
- [ ] Semantic landmarks: header, nav, main, footer
- [ ] All images have alt text
- [ ] Form fields have labels and required indicators
- [ ] Keyboard navigation works throughout
- [ ] Visible focus states on all interactive elements
- [ ] aria-labels on buttons and links where text is not descriptive
- [ ] Color contrast meets WCAG AA

## Forms

- [ ] Signal Session form submits correctly
- [ ] Contact form submits correctly
- [ ] Success states display after submission
- [ ] Error states display on failure
- [ ] Required field validation works

## No Em Dashes

- [ ] No em dashes (unicode U+2014) appear in any rendered output
- [ ] No en dashes (unicode U+2013) appear in any rendered output

## Performance

- [ ] Images use next/image with proper sizing
- [ ] Hero images use priority loading
- [ ] Fonts loaded with display: swap
- [ ] Static pages pre-rendered at build time
- [ ] Build completes without errors
