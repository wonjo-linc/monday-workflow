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

  // Test 1: Simple me query
  const meQuery = `
    query {
      me {
        id
        name
        email
      }
    }
  `;

  try {
    console.log('\n--- Test 1: Me Query ---');
    const response = await axios.post(
      apiUrl,
      { query: meQuery },
      {
        headers: {
          'Authorization': apiToken,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✓ Success!');
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.log('✗ Failed');
    if (axios.isAxiosError(error)) {
      console.log('Status:', error.response?.status);
      console.log('Status Text:', error.response?.statusText);
      console.log('Error data:', JSON.stringify(error.response?.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }

  // Test 2: Boards query with limit
  const boardsQuery = `
    query {
      boards(limit: 5) {
        id
        name
      }
    }
  `;

  try {
    console.log('\n--- Test 2: Boards Query (Limited) ---');
    const response = await axios.post(
      apiUrl,
      { query: boardsQuery },
      {
        headers: {
          'Authorization': apiToken,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✓ Success!');
    console.log('Response data:', JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.log('✗ Failed');
    if (axios.isAxiosError(error)) {
      console.log('Status:', error.response?.status);
      console.log('Status Text:', error.response?.statusText);
      console.log('Error data:', JSON.stringify(error.response?.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

testConnection();
