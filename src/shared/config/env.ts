export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  APP_NAME: 'Chat con IA',
  APP_VERSION: '1.0.0',
} as const;