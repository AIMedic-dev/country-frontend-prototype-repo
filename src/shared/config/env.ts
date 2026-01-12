export const ENV = {
  // API REST Base URL
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  
  // WebSocket URL (Socket.IO)
  WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:3000',
  
  // Analytics API URL
  ANALYTICS_API_URL: import.meta.env.VITE_ANALYTICS_API_URL || '',
  ANALYTICS_API_TIMEOUT: Number(import.meta.env.VITE_ANALYTICS_API_TIMEOUT) || 180000,
  
  // Azure Speech to Text
  AZURE_SPEECH_KEY: import.meta.env.VITE_AZURE_SPEECH_KEY || '',
  AZURE_SPEECH_REGION: import.meta.env.VITE_AZURE_SPEECH_REGION || '',
  
  // Otros configs
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;

// Debug (quitar después)
// console.log('🔧 ENV loaded:', ENV);