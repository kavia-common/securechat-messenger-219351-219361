import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Colors, Radius } from '../../theme/colors';
import { api } from '../../api/client';
import { storage } from '../../storage';

type Nav = { reset: (opts: { index: number; routes: { name: string }[] }) => void; navigate: (name: string) => void };

type Props = {
  navigation: Nav;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const onLogin = async () => {
    setBusy(true);
    try {
      const res = await api.login(email.trim(), password);
      await storage.setToken(res.token);
      await storage.setUser(res.user);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Please try again';
      Alert.alert('Login failed', msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        placeholderTextColor={Colors.mutedText}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        placeholderTextColor={Colors.mutedText}
      />
      <TouchableOpacity style={styles.button} onPress={onLogin} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>
          Don&apos;t have an account? <Text style={{ color: Colors.primary }}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: Colors.background },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  subtitle: { fontSize: 15, color: Colors.mutedText, marginBottom: 20 },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 12,
    color: Colors.text,
    marginBottom: 12,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginVertical: 12,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', color: Colors.mutedText, marginTop: 8 },
});
