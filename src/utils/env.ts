import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  apiBaseUrl: process.env.API_BASE_URL ?? 'https://reqres.in',
  reqresApiKey: process.env.REQRES_API_KEY ?? '',
};