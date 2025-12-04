import Constants from 'expo-constants';

type ExtraConfig = {
  API_BASE_URL?: string;
  WS_URL?: string;
};

const extras = (Constants?.expoConfig?.extra || {}) as ExtraConfig;

export const CONFIG = {
  // PUBLIC_INTERFACE
  API_BASE_URL: (extras.API_BASE_URL || 'http://localhost:3001').replace(/\/+$/, ''),
  // PUBLIC_INTERFACE
  WS_URL: extras.WS_URL || 'ws://localhost:3001/ws/chat',
};
