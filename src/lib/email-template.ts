/**
 * Shared branded email template for all transactional emails.
 * Matches the Cosmic Reach Creative dark theme.
 */

const DOMAIN = "https://cosmicreachcreative.com";
const LOGO_URL = `${DOMAIN}/logo/logo-primary-dark.png`;

/**
 * Wraps email body content in the branded dark-theme shell.
 * Pass HTML content rows (each wrapped in <tr><td>...</td></tr>).
 */
export function brandedEmailShell(bodyRows: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <style>
    body, table, td { font-family: -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    body { margin: 0; padding: 0; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#0b1120;">
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b1120;"><tr><td><![endif]-->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#0b1120;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="520" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px; width:100%;">
          <!-- Logo Header -->
          <tr>
            <td style="padding:0 0 28px; text-align:center;">
              <a href="${DOMAIN}" style="text-decoration:none;">
                <img src="${LOGO_URL}" alt="Cosmic Reach Creative" width="180" style="display:inline-block; max-width:180px; height:auto;" />
              </a>
            </td>
          </tr>
          ${bodyRows}
          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0; text-align:center;">
              <p style="font-size:12px; color:rgba(232,223,207,0.25); margin:0; line-height:1.5;">
                Cosmic Reach Creative · <a href="${DOMAIN}" style="color:rgba(212,165,116,0.5); text-decoration:none;">cosmicreachcreative.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]-->
</body>
</html>`.trim();
}

/**
 * Creates a standard card section (dark navy card with copper accent).
 */
export function emailCard(content: string): string {
  return `
          <tr>
            <td style="background-color:#111827; border-radius:12px; border:1px solid rgba(212,165,116,0.15); padding:28px 24px;">
              ${content}
            </td>
          </tr>`;
}

/**
 * Creates a section heading row inside a card.
 */
export function emailSectionLabel(label: string): string {
  return `<p style="font-size:11px; text-transform:uppercase; letter-spacing:2px; color:#d4a574; margin:0 0 6px; font-weight:700;">${label}</p>`;
}

/**
 * Creates a key-value row for data fields.
 */
export function emailField(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:4px 0;">
        <span style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:rgba(232,223,207,0.3); font-weight:600;">${label}</span><br />
        <span style="font-size:14px; color:#e8dfcf;">${escapeHtml(value)}</span>
      </td>
    </tr>`;
}

/**
 * Creates a paragraph of body text.
 */
export function emailParagraph(text: string): string {
  return `<p style="font-size:14px; color:rgba(232,223,207,0.7); line-height:1.6; margin:0 0 12px;">${escapeHtml(text)}</p>`;
}

/**
 * Creates a copper CTA button.
 */
export function emailButton(label: string, href: string): string {
  return `
    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:20px 0 8px;">
      <tr>
        <td style="background-color:#d4a574; border-radius:8px;">
          <a href="${href}" style="display:inline-block; padding:12px 28px; font-size:14px; font-weight:700; color:#0b1120; text-decoration:none; letter-spacing:0.3px;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

/**
 * Creates a subtle info block (for secondary content).
 */
export function emailInfoBlock(content: string): string {
  return `
    <div style="background-color:rgba(232,223,207,0.03); border:1px solid rgba(232,223,207,0.06); border-radius:8px; padding:14px 16px; margin:12px 0;">
      ${content}
    </div>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br />");
}
