import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types';

const KEYS = {
  token: 'auth.token',
  user: 'auth.user',
};

export const storage = {
  // PUBLIC_INTERFACE
  async setToken(token: string) {
    /** Store auth token securely */
    await AsyncStorage.setItem(KEYS.token, token);
  },
  // PUBLIC_INTERFACE
  async getToken(): Promise<string | null> {
    /** Retrieve auth token */
    return AsyncStorage.getItem(KEYS.token);
  },
  // PUBLIC_INTERFACE
  async clearToken() {
    /** Clear auth token */
    await AsyncStorage.removeItem(KEYS.token);
  },
  // PUBLIC_INTERFACE
  async setUser(user: User) {
    /** Store user profile JSON */
    await AsyncStorage.setItem(KEYS.user, JSON.stringify(user));
  },
  // PUBLIC_INTERFACE
  async getUser<T = User>(): Promise<T | null> {
    /** Retrieve user profile JSON */
    const v = await AsyncStorage.getItem(KEYS.user);
    return v ? (JSON.parse(v) as T) : null;
  },
  // PUBLIC_INTERFACE
  async clearUser() {
    /** Clear user profile */
    await AsyncStorage.removeItem(KEYS.user);
  },
};
