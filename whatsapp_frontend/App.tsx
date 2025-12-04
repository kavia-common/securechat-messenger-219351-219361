import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import RootNavigator from './src/navigation';
import { Colors } from './src/theme/colors';
import { chatSocket } from './src/ws/chatSocket';
import { requestPushPermission } from './src/services/notifications';

export default function App() {
  useEffect(() => {
    // Initialize WebSocket connection on app start
    chatSocket.connect();

    // Request push permissions (local notifications)
    requestPushPermission();

    return () => {
      chatSocket.disconnect();
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <RootNavigator />
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
    </View>
  );
}
