/**
 * One-time script to get a Google Calendar refresh token.
 *
 * Usage:
 *   node scripts/get-google-token.mjs
 *
 * 1. Opens a browser to Google's consent screen
 * 2. After you authorize, Google redirects to a local server on port 3456
 * 3. The script exchanges the code for a refresh token and prints it
 * 4. Add the refresh token to .env.local as GOOGLE_REFRESH_TOKEN
 */

import { createServer } from "http";
import { URL } from "url";
import { google } from "googleapis";
import { execSync } from "child_process";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const PORT = 3456;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

const oauth2 = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

const authUrl = oauth2.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/calendar"],
});

console.log("\n📋 First, add this redirect URI to Google Cloud Console:");
console.log(`   ${REDIRECT_URI}\n`);
console.log("🌐 Then opening browser for Google sign-in...\n");

// Open browser
try {
  execSync(`open "${authUrl}"`);
} catch {
  console.log("Open this URL in your browser:");
  console.log(authUrl);
}

// Start temporary local server to catch the callback
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/callback") {
    const code = url.searchParams.get("code");

    if (!code) {
      res.writeHead(400);
      res.end("No code received");
      return;
    }

    try {
      const { tokens } = await oauth2.getToken(code);
      console.log("\n✅ Success! Add this to your .env.local:\n");
      console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <html><body style="background:#0b1120;color:#e8dfcf;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0">
          <div style="text-align:center">
            <h1 style="color:#d4a574">✅ Token received!</h1>
            <p>Check your terminal for the refresh token.</p>
            <p>You can close this tab.</p>
          </div>
        </body></html>
      `);
    } catch (err) {
      console.error("❌ Error exchanging code:", err.message);
      res.writeHead(500);
      res.end("Error exchanging code: " + err.message);
    }

    // Shut down after handling
    setTimeout(() => process.exit(0), 1000);
  }
});

server.listen(PORT, () => {
  console.log(`⏳ Waiting for Google callback on port ${PORT}...`);
});
