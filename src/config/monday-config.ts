import { config } from 'dotenv';
import { MondayConfig } from '../types/monday.types.js';

config();

export const mondayConfig: MondayConfig = {
  apiToken: process.env.MONDAY_API_TOKEN || '',
  apiVersion: process.env.MONDAY_API_VERSION || '2024-10',
  apiUrl: 'https://api.monday.com/v2'
};

export function validateConfig(): void {
  if (!mondayConfig.apiToken) {
    throw new Error('MONDAY_API_TOKEN is required. Please set it in .env file');
  }
}
