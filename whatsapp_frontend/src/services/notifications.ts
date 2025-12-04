import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handling (show while foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// PUBLIC_INTERFACE
export async function requestPushPermission() {
  /** Request push notification permissions; returns granted boolean */
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// PUBLIC_INTERFACE
export async function showMessageNotification(title: string, body: string) {
  /** Show a local notification for a new message */
  // On web or simulators, this may be no-op
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: Platform.OS !== 'web' ? 'default' : undefined },
      trigger: null,
    });
  } catch {
    // ignore
  }
}
