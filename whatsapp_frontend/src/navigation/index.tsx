import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../theme/colors';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ChatsListScreen from '../screens/Chats/ChatsListScreen';
import ContactsScreen from '../screens/Contacts/ContactsScreen';
import ChatScreen from '../screens/Chats/ChatScreen';
import { storage } from '../storage';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      <Tabs.Screen name="ChatsTab" component={ChatsListScreen} options={{ title: 'Chats' }} />
      <Tabs.Screen name="Contacts" component={ContactsScreen} options={{ title: 'Contacts' }} />
    </Tabs.Navigator>
  );
}

export default function RootNavigator() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await storage.getToken();
      setAuthed(!!token);
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: Colors.background, card: '#fff', text: Colors.text, primary: Colors.primary },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!authed ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
