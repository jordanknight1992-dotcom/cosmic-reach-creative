import { availability } from "@/config/booking";

const FROM = "Cosmic Reach <noreply@cosmicreachcreative.com>";
const OWNER_EMAIL = "jordan@cosmicreachcreative.com";
const DOMAIN = "https://cosmicreachcreative.com";
const LOGO_URL = `${DOMAIN}/logo/logo-primary-dark.png`;

interface BookingEmailData {
  clientName: string;
  clientEmail: string;
  bookingTitle: string;
  durationMinutes: number;
  startTime: Date;
  endTime: Date;
  notes?: string;
  bookingId: number;
  googleMeetUrl?: string | null;
}

/**
 * Send both confirmation (to client) and alert (to owner) emails.
 */
export async function sendBookingEmails(data: BookingEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not set — booking emails skipped");
    return;
  }

  const results = await Promise.allSettled([
    sendClientConfirmation(data),
    sendOwnerAlert(data),
  ]);

  results.forEach((r, i) => {
    const label = i === 0 ? "client confirmation" : "owner alert";
    if (r.status === "rejected") {
      console.error(`Failed to send ${label} email:`, r.reason);
    } else {
      console.log(`Successfully sent ${label} email`);
    }
  });
}

/* ─── Client Confirmation ─── */

async function sendClientConfirmation(data: BookingEmailData) {
  const icsContent = generateICS(data);
  const icsBase64 = Buffer.from(icsContent, "utf-8").toString("base64");

  const dateStr = data.startTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: availability.timezone,
  });
  const timeStr = `${fmtTime(data.startTime)} – ${fmtTime(data.endTime)} CT`;

  await resendSend({
    from: FROM,
    to: [data.clientEmail],
    reply_to: OWNER_EMAIL,
    subject: `Confirmed: ${data.bookingTitle} on ${dateStr}`,
    html: clientEmailHTML(data, dateStr, timeStr),
    attachments: [
      {
        filename: "booking.ics",
        content: icsBase64,
      },
    ],
  });
}

/* ─── Owner Alert ─── */

async function sendOwnerAlert(data: BookingEmailData) {
  const dateStr = data.startTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: availability.timezone,
  });
  const timeStr = `${fmtTime(data.startTime)} – ${fmtTime(data.endTime)} CT`;

  await resendSend({
    from: FROM,
    to: [OWNER_EMAIL],
    reply_to: data.clientEmail,
    subject: `New Booking: ${data.bookingTitle} — ${data.clientName}`,
    html: ownerEmailHTML(data, dateStr, timeStr),
  });
}

/* ─── Shared email wrapper ─── */

function emailShell(content: string): string {
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
              <img src="${LOGO_URL}" alt="Cosmic Reach Creative" width="180" style="display:inline-block; max-width:180px; height:auto;" />
            </td>
          </tr>
          ${content}
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

/* ─── Client Confirmation Email ─── */

function clientEmailHTML(
  data: BookingEmailData,
  dateStr: string,
  timeStr: string
): string {
  const meetSection = data.googleMeetUrl
    ? `<tr>
        <td style="padding:12px 20px;">
          <p style="font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#d4a574; margin:0 0 6px; font-weight:600;">Join Meeting</p>
          <a href="${data.googleMeetUrl}" style="display:inline-block; background-color:#d4a574; color:#0b1120; font-size:14px; font-weight:700; padding:10px 24px; border-radius:8px; text-decoration:none; letter-spacing:0.3px;">
            Join Google Meet
          </a>
        </td>
      </tr>`
    : "";

  return emailShell(`
          <!-- Card -->
          <tr>
            <td style="background-color:#111827; border-radius:12px; border:1px solid rgba(212,165,116,0.15);">
              <!-- Session Type Banner -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background:linear-gradient(135deg, #1a1f2e 0%, #111827 100%); border-radius:12px 12px 0 0; padding:24px 24px 20px; border-bottom:1px solid rgba(212,165,116,0.1);">
                    <p style="font-size:11px; text-transform:uppercase; letter-spacing:2px; color:#d4a574; margin:0 0 4px; font-weight:700;">${data.durationMinutes} MINUTES</p>
                    <h1 style="font-size:24px; font-weight:700; color:#e8dfcf; margin:0; letter-spacing:-0.5px;">${data.bookingTitle}</h1>
                  </td>
                </tr>
              </table>

              <!-- Confirmation Body -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:28px 24px 8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:rgba(11,17,32,0.5); border-radius:8px; border:1px solid rgba(232,223,207,0.06);">
                      <tr>
                        <td style="padding:12px 20px;">
                          <p style="font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:rgba(232,223,207,0.35); margin:0 0 4px; font-weight:600;">Date & Time</p>
                          <p style="font-size:16px; color:#e8dfcf; margin:0; font-weight:600;">${dateStr}</p>
                          <p style="font-size:14px; color:rgba(232,223,207,0.6); margin:3px 0 0;">${timeStr}</p>
                        </td>
                      </tr>
                      ${meetSection}
                      <tr>
                        <td style="padding:12px 20px 16px;">
                          <p style="font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:rgba(232,223,207,0.35); margin:0 0 4px; font-weight:600;">Booking ID</p>
                          <p style="font-size:13px; color:rgba(232,223,207,0.4); margin:0;">#${data.bookingId}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px 28px;">
                    <p style="font-size:13px; color:rgba(232,223,207,0.4); text-align:center; margin:0; line-height:1.6;">
                      A calendar invite is attached (.ics). Need to reschedule? Just reply to this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`);
}

/* ─── Owner Alert Email ─── */

function ownerEmailHTML(
  data: BookingEmailData,
  dateStr: string,
  timeStr: string
): string {
  const meetRow = data.googleMeetUrl
    ? `<tr>
        <td style="padding:6px 0; color:rgba(232,223,207,0.45); width:80px; vertical-align:top; font-size:13px;">Meet</td>
        <td style="padding:6px 0;"><a href="${data.googleMeetUrl}" style="color:#d4a574; font-size:13px;">${data.googleMeetUrl}</a></td>
      </tr>`
    : "";

  return emailShell(`
          <tr>
            <td style="background-color:#111827; border-radius:12px; border:1px solid rgba(212,165,116,0.15);">
              <!-- Header Banner -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background:linear-gradient(135deg, #1a1f2e 0%, #111827 100%); border-radius:12px 12px 0 0; padding:20px 24px; border-bottom:1px solid rgba(212,165,116,0.1);">
                    <p style="font-size:11px; text-transform:uppercase; letter-spacing:2px; color:#d4a574; margin:0 0 4px; font-weight:700;">NEW BOOKING</p>
                    <h1 style="font-size:20px; font-weight:700; color:#e8dfcf; margin:0;">${data.bookingTitle} — ${data.clientName}</h1>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:20px 24px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size:14px; color:#e8dfcf;">
                      <tr>
                        <td style="padding:6px 0; color:rgba(232,223,207,0.45); width:80px; font-size:13px;">Client</td>
                        <td style="padding:6px 0; font-weight:600;">${data.clientName}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:rgba(232,223,207,0.45); font-size:13px;">Email</td>
                        <td style="padding:6px 0;"><a href="mailto:${data.clientEmail}" style="color:#d4a574; text-decoration:none;">${data.clientEmail}</a></td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:rgba(232,223,207,0.45); font-size:13px;">When</td>
                        <td style="padding:6px 0;">${dateStr}<br/><span style="color:rgba(232,223,207,0.6); font-size:13px;">${timeStr}</span></td>
                      </tr>
                      ${meetRow}
                      ${data.notes ? `
                      <tr>
                        <td style="padding:6px 0; color:rgba(232,223,207,0.45); vertical-align:top; font-size:13px;">Notes</td>
                        <td style="padding:6px 0; color:rgba(232,223,207,0.6); font-size:13px;">${escapeHtml(data.notes)}</td>
                      </tr>` : ""}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`);
}

/* ─── ICS Calendar File ─── */

function generateICS(data: BookingEmailData): string {
  const uid = `booking-${data.bookingId}@cosmicreachcreative.com`;
  const now = formatICSDate(new Date());
  const start = formatICSDate(data.startTime);
  const end = formatICSDate(data.endTime);

  const locationLine = data.googleMeetUrl
    ? `LOCATION:${data.googleMeetUrl}`
    : "";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cosmic Reach Creative//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${data.bookingTitle} — Cosmic Reach Creative`,
    `DESCRIPTION:${data.durationMinutes}-minute session with Cosmic Reach Creative.${data.googleMeetUrl ? `\\nJoin: ${data.googleMeetUrl}` : ""}${data.notes ? `\\nNotes: ${data.notes.replace(/\n/g, "\\n")}` : ""}`,
    locationLine,
    `ORGANIZER;CN=Cosmic Reach:mailto:${OWNER_EMAIL}`,
    `ATTENDEE;CN=${data.clientName};RSVP=TRUE:mailto:${data.clientEmail}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${data.bookingTitle} starts in 15 minutes`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

/* ─── Helpers ─── */

function fmtTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: availability.timezone,
  });
}

function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function resendSend(payload: {
  from: string;
  to: string[];
  reply_to?: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: string }[];
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const errMsg = `Resend error (${res.status}): ${JSON.stringify(err)}`;
    console.error(errMsg);
    throw new Error(errMsg);
  }
  const result = await res.json().catch(() => ({}));
  console.log("Resend email sent:", result.id, "to:", payload.to);
}
