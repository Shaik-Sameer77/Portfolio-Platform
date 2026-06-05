/**
 * MANUAL UTILITY SCRIPT: Exchange Auth Code for Refresh Token
 * 
 * Importance:
 * Similar to get-google-token.js, this script is NOT required by the backend application.
 * It is a fallback/manual developer utility.
 * 
 * Purpose:
 * If you manually obtained an OAuth authorization code from Google (by visiting the auth 
 * URL yourself), you can use this script to exchange that code for the final REFRESH_TOKEN.
 * 
 * Usage:
 * node exchange-token.js "YOUR_AUTH_CODE_HERE"
 */
import 'dotenv/config';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:8001/auth/google/callback'
);

// Pass the authorization code as a CLI argument: node exchange-token.js <code>
const code = process.argv[2] || 'PASTE_YOUR_AUTH_CODE_HERE';

async function exchange() {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n--- SUCCESS! ---');
    console.log('Add this to your backend/.env file:\n');
    console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token);
  } catch (err) {
    console.error('Error exchanging token', err.response?.data || err.message);
  }
}

exchange();
