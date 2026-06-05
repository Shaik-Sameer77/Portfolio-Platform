/**
 * ONE-TIME UTILITY SCRIPT: Get Google OAuth Authorization Code
 * 
 * Importance:
 * This script is NOT used by the running backend application. It is a local developer
 * utility used ONLY when initially setting up the Google Calendar integration, or if 
 * the existing refresh token expires or is revoked.
 * 
 * Purpose:
 * It generates an authorization URL and starts a temporary local server. When you visit 
 * the URL and authorize the app, Google redirects you back to this local server with an 
 * authorization code. This code is then automatically exchanged for a long-lived REFRESH_TOKEN 
 * which you must save in your .env file.
 * 
 * Usage:
 * node get-google-token.js
 */
import 'dotenv/config';
import { google } from 'googleapis';
import http from 'http';
import { URL } from 'url';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:8001/auth/google/callback'
);

const scopes = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent',
});

console.log('--- ACTION REQUIRED ---');
console.log('1. Click this URL to authorize the application:');
console.log(authUrl);
console.log('\nWaiting for authorization callback on port 8001...');

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/auth/google/callback')) {
      const qs = new URL(req.url, 'http://localhost:8001').searchParams;
      const code = qs.get('code');

      if (code) {
        res.end('Authentication successful! You can close this tab and check your terminal.');
        const { tokens } = await oauth2Client.getToken(code);
        console.log('\n--- SUCCESS! ---');
        console.log('Add the following to your backend/.env file:\n');
        console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
        console.log(`GOOGLE_CALENDAR_ID=primary`);
        console.log('\nServer is exiting...');
        server.close();
        process.exit(0);
      }
    }
  } catch (e) {
    console.error(e);
    res.end('An error occurred during authentication.');
  }
});

server.listen(8001, () => {
  // Server started
});
