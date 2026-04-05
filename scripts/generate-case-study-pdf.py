#!/usr/bin/env python3
"""
La Chérie Weddings Case Study – 2-page front/back PDF
Cosmic Reach Creative brand system
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Paths ──
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(BASE, "public", "fonts")
OUTPUT = os.path.join(BASE, "public", "downloads", "la-cherie-case-study.pdf")
os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)

# ── Fonts ──
pdfmetrics.registerFont(TTFont("SG-Bold", os.path.join(FONTS, "SpaceGrotesk-Bold.ttf")))
pdfmetrics.registerFont(TTFont("SG-Semi", os.path.join(FONTS, "SpaceGrotesk-SemiBold.ttf")))
pdfmetrics.registerFont(TTFont("Inter", os.path.join(FONTS, "Inter-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Inter-Semi", os.path.join(FONTS, "Inter-SemiBold.ttf")))

# ── Brand palette ──
DEEP_SPACE = HexColor("#0B1120")
SURFACE    = HexColor("#111827")
STARLIGHT  = HexColor("#E8DFCF")
COPPER     = HexColor("#D4A574")
SPARK_RED  = HexColor("#E04747")
MUTED      = HexColor("#9B9488")
GREEN      = HexColor("#4ADE80")
FAINT      = HexColor("#D4A57422")
CARD_BORDER = HexColor("#D4A57428")
BAR_BG     = HexColor("#E8DFCF12")

W, H = letter
MX = 56          # horizontal margin
CW = W - 2 * MX  # content width


# ═══════════════════════════════════════════════════════════
# Drawing helpers
# ═══════════════════════════════════════════════════════════

def bg(c):
    c.setFillColor(DEEP_SPACE)
    c.rect(0, 0, W, H, fill=1, stroke=0)


def header(c):
    y = H - 40
    c.setFont("SG-Semi", 8.5)
    c.setFillColor(COPPER)
    c.drawString(MX, y, "COSMIC REACH CREATIVE")
    # badge
    badge = "CASE STUDY"
    c.setFont("SG-Semi", 7.5)
    tw = c.stringWidth(badge, "SG-Semi", 7.5)
    bx = W - MX - tw - 14
    c.setStrokeColor(COPPER)
    c.setLineWidth(0.6)
    c.roundRect(bx, y - 3, tw + 14, 16, 3, fill=0, stroke=1)
    c.setFillColor(MUTED)
    c.drawString(bx + 7, y, badge)
    # rule
    c.setStrokeColor(FAINT)
    c.setLineWidth(0.5)
    c.line(MX, y - 12, W - MX, y - 12)


def footer(c, num):
    c.setStrokeColor(FAINT)
    c.setLineWidth(0.5)
    c.line(MX, 54, W - MX, 54)
    c.setFont("Inter", 7.5)
    c.setFillColor(MUTED)
    c.drawString(MX, 38, "cosmicreachcreative.com/work/la-cherie")
    c.drawRightString(W - MX, 38, f"0{num}")


def tag(c, label, y):
    """Section tag: red dot + copper line + label."""
    c.setFillColor(SPARK_RED)
    c.circle(MX + 3.5, y + 3, 3, fill=1, stroke=0)
    c.setStrokeColor(COPPER)
    c.setLineWidth(0.8)
    c.line(MX + 12, y + 3, MX + 42, y + 3)
    c.setFont("SG-Semi", 8)
    c.setFillColor(COPPER)
    c.drawString(MX + 48, y, label)


def card(c, x, y, w, h, border=None):
    c.setFillColor(SURFACE)
    c.setStrokeColor(border or CARD_BORDER)
    c.setLineWidth(0.6)
    c.roundRect(x, y, w, h, 6, fill=1, stroke=1)


def wrap(c, text, font, size, max_w):
    """Word-wrap, return list of lines."""
    c.setFont(font, size)
    words = text.split()
    lines, cur = [], ""
    for w in words:
        t = f"{cur} {w}".strip()
        if c.stringWidth(t, font, size) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def body(c, text, x, y, font, size, color, max_w, lead=None):
    """Draw wrapped text. Return y after last line."""
    lead = lead or size * 1.5
    c.setFillColor(color)
    for ln in wrap(c, text, font, size, max_w):
        c.setFont(font, size)
        c.drawString(x, y, ln)
        y -= lead
    return y


def bullet(c, x, y, r=2.2):
    c.setFillColor(COPPER)
    c.circle(x + r, y + 3, r, fill=1, stroke=0)


# ═══════════════════════════════════════════════════════════
# PAGE 1 – FRONT
# ═══════════════════════════════════════════════════════════

def page_front(c):
    bg(c)
    header(c)

    # ── Title block ──
    y = H - 96
    c.setFont("SG-Bold", 36)
    c.setFillColor(COPPER)
    c.drawString(MX, y, "La Ch\u00e9rie Weddings")

    y -= 32
    c.setFont("Inter-Semi", 14)
    c.setFillColor(STARLIGHT)
    y = body(c,
        "She delivered a premium experience. Anyone who hadn\u2019t spoken to her had no way to know.",
        MX, y, "Inter-Semi", 14, STARLIGHT, CW, 21)

    y -= 6
    tags_text = ["Luxury Weddings", "Memphis, TN", "Full Brand System", "30 Days"]
    c.setFont("Inter", 9)
    tx = MX
    for i, t in enumerate(tags_text):
        c.setFillColor(MUTED)
        c.drawString(tx, y, t)
        tx += c.stringWidth(t, "Inter", 9)
        if i < len(tags_text) - 1:
            c.setFillColor(COPPER)
            c.drawString(tx + 5, y, "\u2022")
            tx += 14

    # thin rule
    y -= 18
    c.setStrokeColor(FAINT)
    c.setLineWidth(0.4)
    c.line(MX, y, W - MX, y)

    # ── THE PROBLEM ──
    y -= 22
    tag(c, "THE PROBLEM", y)

    y -= 24
    y = body(c,
        "La Ch\u00e9rie Weddings was fully booked through referrals. The events were editorial-quality. "
        "Couples were deeply loyal. None of that was visible to anyone discovering the business online.",
        MX, y, "Inter", 10.5, MUTED, CW, 15.5)

    y -= 6
    y = body(c,
        "The website read like a placeholder. There was no brand language reflecting the real experience, "
        "no visible offer structure. A first-time visitor had no way to understand what La Ch\u00e9rie delivers "
        "or why it costs what it costs.",
        MX, y, "Inter", 10.5, MUTED, CW, 15.5)

    # ── WHY IT MATTERED ──
    y -= 20
    tag(c, "WHY IT MATTERED", y)

    y -= 24
    y = body(c,
        "Every non-referral visitor was starting from zero. The site gave no evidence of the premium "
        "experience behind it. No guided path to an inquiry. No trust signals.",
        MX, y, "Inter", 10.5, MUTED, CW, 15.5)

    y -= 6
    y = body(c,
        "The gap between reputation and online presence was costing the business leads it had already earned.",
        MX, y, "Inter", 10.5, MUTED, CW, 15.5)

    # ── THE CLARITY AUDIT ──
    y -= 20
    tag(c, "THE CLARITY AUDIT", y)

    y -= 24
    y = body(c,
        "We scored four layers of the business system. Every layer was underperforming relative to the quality of the actual work.",
        MX, y, "Inter", 10.5, MUTED, CW, 15.5)

    # ── Score rows ──
    y -= 14
    scores = [
        ("Signal",  "Messaging",      2, 7),
        ("Gravity", "Offer",          1, 7),
        ("Orbit",   "Path to Action", 2, 8),
        ("Thrust",  "Visibility",     1, 6),
    ]

    row_h = 38
    for name, label, bef, aft in scores:
        # Name
        c.setFont("SG-Semi", 11)
        c.setFillColor(COPPER)
        c.drawString(MX, y, name)
        # Label
        c.setFont("Inter", 8.5)
        c.setFillColor(MUTED)
        c.drawString(MX + 70, y + 1, label)
        # Scores right-aligned
        score_x = W - MX - 56
        c.setFont("SG-Bold", 12)
        c.setFillColor(HexColor("#E8DFCF40"))
        c.drawString(score_x, y, str(bef))
        c.setFont("Inter", 9)
        c.setFillColor(MUTED)
        c.drawString(score_x + 16, y + 1, "\u2192")
        c.setFont("SG-Bold", 12)
        c.setFillColor(COPPER)
        c.drawString(score_x + 34, y, str(aft))
        # Progress bar
        bar_y = y - 10
        bar_w = CW
        bar_h = 3
        c.setFillColor(BAR_BG)
        c.roundRect(MX, bar_y, bar_w, bar_h, 1.5, fill=1, stroke=0)
        c.setFillColor(COPPER)
        c.roundRect(MX, bar_y, bar_w * (aft / 10), bar_h, 1.5, fill=1, stroke=0)

        y -= row_h

    # ── Overall score card ──
    y -= 4
    card_h = 48
    card(c, MX, y - card_h + 14, CW, card_h, COPPER)
    iy = y - 6
    c.setFont("SG-Semi", 8)
    c.setFillColor(COPPER)
    c.drawString(MX + 16, iy, "SYSTEM MOMENTUM SCORE")
    c.setFont("Inter", 9.5)
    c.setFillColor(STARLIGHT)
    c.drawString(MX + 16, iy - 16, "Operating at 16% of potential.")
    # Big numbers right side
    nx = W - MX - 130
    c.setFont("SG-Bold", 24)
    c.setFillColor(SPARK_RED)
    c.drawString(nx, iy - 12, "1.6")
    c.setFont("Inter", 14)
    c.setFillColor(MUTED)
    c.drawString(nx + 38, iy - 10, "\u2192")
    c.setFont("SG-Bold", 24)
    c.setFillColor(GREEN)
    c.drawString(nx + 62, iy - 12, "7.0")

    footer(c, 1)


# ═══════════════════════════════════════════════════════════
# PAGE 2 – BACK
# ═══════════════════════════════════════════════════════════

def page_back(c):
    bg(c)
    header(c)

    # ── WHAT WE BUILT ──
    y = H - 90
    tag(c, "WHAT WE BUILT", y)

    y -= 24
    y = body(c,
        "The brand system was built from the way La Ch\u00e9rie already works with couples. "
        "Every element was designed to make new visitors feel the same confidence that referrals already had.",
        MX, y, "Inter", 10.5, MUTED, CW, 15.5)

    # Deliverables in 2 columns
    y -= 10
    deliverables = [
        "38-page Brand Guidelines document",
        "Brand voice and messaging framework",
        "Portfolio gallery with editorial layout",
        "SEO foundation with schema and sitemap",
        "Full website redesign and build",
        "Service tier structure and pricing model",
        "Inquiry flow redesign (4 clicks to 1)",
        "Mobile-first responsive implementation",
    ]

    col_w = (CW - 24) / 2
    for i, item in enumerate(deliverables):
        col = i // 4  # first 4 left, next 4 right
        row = i % 4
        ix = MX + col * (col_w + 24)
        iy = y - row * 20
        bullet(c, ix, iy)
        c.setFont("Inter", 10)
        c.setFillColor(STARLIGHT)
        c.drawString(ix + 10, iy, item)

    y -= 4 * 20 + 16

    # ── WHAT CHANGED ──
    tag(c, "WHAT CHANGED", y)

    y -= 24
    changes = [
        "New visitors identify what La Ch\u00e9rie does and why it\u2019s different within seconds of landing",
        "The visual identity and content now match the in-person experience",
        "Offer structure and pricing context are accessible from the homepage",
        "Path from landing to inquiry went from four clicks to one",
    ]

    for item in changes:
        bullet(c, MX, y)
        c.setFont("Inter", 10.5)
        c.setFillColor(STARLIGHT)
        lines = wrap(c, item, "Inter", 10.5, CW - 14)
        for ln in lines:
            c.drawString(MX + 10, y, ln)
            y -= 15
        y -= 7

    # ── FOUNDER PERSPECTIVE ──
    y -= 8
    tag(c, "FOUNDER PERSPECTIVE", y)

    y -= 20
    # Vertical copper bar for quote
    quote_top = y + 6
    c.setFont("Inter", 11)
    c.setFillColor(STARLIGHT)
    y = body(c,
        "\u201cJordan took what felt overwhelming and turned it into something clear, beautiful, "
        "and genuinely easy to trust. Seeing the site come together made me feel as proud of my "
        "business online as I do when everything comes together on a wedding day.\u201d",
        MX + 16, y, "Inter", 11, STARLIGHT, CW - 20, 17)

    y -= 6
    c.setFont("SG-Semi", 9.5)
    c.setFillColor(COPPER)
    c.drawString(MX + 16, y, "Founder, La Ch\u00e9rie Weddings")

    quote_bottom = y - 4
    # Draw vertical bar
    c.setStrokeColor(COPPER)
    c.setLineWidth(2)
    c.line(MX + 4, quote_top, MX + 4, quote_bottom)

    # ── CTA ──
    y -= 36
    c.setStrokeColor(FAINT)
    c.setLineWidth(0.4)
    c.line(MX, y, W - MX, y)

    y -= 28
    c.setFont("SG-Bold", 20)
    c.setFillColor(STARLIGHT)
    lines = wrap(c, "If your work is ahead of your website, the gap is costing you.", "SG-Bold", 20, CW)
    for ln in lines:
        c.drawString(MX, y, ln)
        y -= 26

    y -= 6
    y = body(c,
        "The Clarity Audit scores your messaging, offer, site, and visibility and tells you exactly "
        "where trust is breaking down. $150. Delivered in 3 to 5 business days.",
        MX, y, "Inter", 10.5, MUTED, CW, 15.5)

    # CTA button
    y -= 14
    btn = "Get your Clarity Audit"
    c.setFont("SG-Semi", 11)
    tw = c.stringWidth(btn, "SG-Semi", 11)
    btn_w, btn_h = tw + 36, 34
    c.setFillColor(SPARK_RED)
    c.roundRect(MX, y, btn_w, btn_h, 5, fill=1, stroke=0)
    c.setFillColor(HexColor("#FFFFFF"))
    c.drawString(MX + 18, y + 10, btn)

    c.setFont("Inter", 9.5)
    c.setFillColor(MUTED)
    c.drawString(MX + btn_w + 14, y + 10, "cosmicreachcreative.com/clarity")

    footer(c, 2)


# ═══════════════════════════════════════════════════════════
# Build
# ═══════════════════════════════════════════════════════════

def main():
    c = canvas.Canvas(OUTPUT, pagesize=letter)
    c.setTitle("La Ch\u00e9rie Weddings Case Study \u2013 Cosmic Reach Creative")
    c.setAuthor("Cosmic Reach Creative")
    c.setSubject("Case Study: Trust Gap to Premium Positioning")

    page_front(c)
    c.showPage()
    page_back(c)
    c.showPage()

    c.save()
    size = os.path.getsize(OUTPUT) / 1024
    print(f"Done: {OUTPUT}")
    print(f"Pages: 2  |  Size: {size:.1f} KB")


if __name__ == "__main__":
    main()
