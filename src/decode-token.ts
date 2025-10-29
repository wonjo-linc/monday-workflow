import { config } from 'dotenv';

config();

function decodeJWT(token: string) {
  try {
    // JWT는 header.payload.signature 형식
    const parts = token.split('.');

    if (parts.length !== 3) {
      console.log('❌ Invalid JWT format. Expected 3 parts (header.payload.signature), got:', parts.length);
      return;
    }

    console.log('JWT Structure:');
    console.log('- Header length:', parts[0].length);
    console.log('- Payload length:', parts[1].length);
    console.log('- Signature length:', parts[2].length);

    // Base64 decode the header
    const headerJson = Buffer.from(parts[0], 'base64').toString();
    console.log('\n--- Header ---');
    console.log(JSON.stringify(JSON.parse(headerJson), null, 2));

    // Base64 decode the payload
    const payloadJson = Buffer.from(parts[1], 'base64').toString();
    console.log('\n--- Payload ---');
    const payload = JSON.parse(payloadJson);
    console.log(JSON.stringify(payload, null, 2));

    // Check expiration
    if (payload.exp) {
      const expirationDate = new Date(payload.exp * 1000);
      const now = new Date();
      console.log('\n--- Token Validity ---');
      console.log('Expires at:', expirationDate.toISOString());
      console.log('Current time:', now.toISOString());
      console.log('Is expired:', now > expirationDate);
      console.log('Time until expiration:', Math.floor((expirationDate.getTime() - now.getTime()) / 1000 / 60), 'minutes');
    }

    // Check issued at
    if (payload.iad) {
      const issuedDate = new Date(payload.iad);
      console.log('Issued at:', issuedDate.toISOString());
    }

    // Check permissions
    if (payload.per) {
      console.log('\n--- Permissions ---');
      console.log('Scopes:', payload.per);
    }

  } catch (error: any) {
    console.error('❌ Error decoding JWT:', error.message);
  }
}

const token = process.env.MONDAY_API_TOKEN;
if (!token) {
  console.error('❌ MONDAY_API_TOKEN not found in .env');
  process.exit(1);
}

console.log('Decoding Monday.com API Token...\n');
console.log('Token (first 30 chars):', token.substring(0, 30) + '...');
console.log('Token length:', token.length);
console.log('\n' + '='.repeat(50) + '\n');

decodeJWT(token);
