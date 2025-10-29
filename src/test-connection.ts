import axios from 'axios';
import { config } from 'dotenv';

config();

async function testConnection() {
  const apiToken = process.env.MONDAY_API_TOKEN;
  const apiUrl = 'https://api.monday.com/v2';

  console.log('Testing Monday.com API connection...\n');
  console.log('API URL:', apiUrl);
  console.log('Token (first 20 chars):', apiToken?.substring(0, 20) + '...');
  console.log('Token length:', apiToken?.length);

  // Simple me query
  const meQuery = `
    query {
      me {
        id
        name
        email
      }
    }
  `;

  const authMethods = [
    {
      name: 'Authorization header (token only)',
      headers: {
        'Authorization': apiToken,
        'Content-Type': 'application/json'
      }
    },
    {
      name: 'Authorization header (Bearer prefix)',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    },
    {
      name: 'API-Token header',
      headers: {
        'API-Token': apiToken,
        'Content-Type': 'application/json'
      }
    },
    {
      name: 'Authorization + API-Version',
      headers: {
        'Authorization': apiToken,
        'Content-Type': 'application/json',
        'API-Version': '2024-10'
      }
    },
    {
      name: 'Authorization + API-Version (2023-10)',
      headers: {
        'Authorization': apiToken,
        'Content-Type': 'application/json',
        'API-Version': '2023-10'
      }
    },
    {
      name: 'Query parameter',
      headers: {
        'Content-Type': 'application/json'
      },
      useQueryParam: true
    }
  ];

  for (const method of authMethods) {
    try {
      console.log(`\n--- Testing: ${method.name} ---`);

      const url = method.useQueryParam ? `${apiUrl}?api_token=${apiToken}` : apiUrl;

      const response = await axios.post(
        url,
        { query: meQuery },
        { headers: method.headers }
      );

      console.log('✅ SUCCESS!');
      console.log('Response:', JSON.stringify(response.data, null, 2));
      console.log('\n🎉 Working authentication method found!');
      return;
    } catch (error: any) {
      console.log('❌ Failed');
      if (axios.isAxiosError(error)) {
        console.log('   Status:', error.response?.status);
        console.log('   Error:', error.response?.data || error.message);
      } else {
        console.log('   Error:', error.message);
      }
    }
  }

  console.log('\n❌ All authentication methods failed.');
}

testConnection();
