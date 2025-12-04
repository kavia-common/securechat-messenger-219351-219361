import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors, Radius } from '../../theme/colors';
import { api } from '../../api/client';
import { Avatar } from '../../components/Avatar';
import { Header } from '../../components/Header';
import type { Contact } from '../../types';

type Nav = { navigate: (name: string, params?: Record<string, unknown>) => void };
type Props = { navigation: Nav };

const ContactsScreen: React.FC<Props> = ({ navigation }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [q, setQ] = useState('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setContacts(await api.listContacts());
      } catch {
        // ignore
      }
    })();
  }, []);

  const onSearch = async (text: string) => {
    setQ(text);
    if (text.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      setSearchResults(await api.searchUsers(text.trim()));
    } catch {
      setSearchResults([]);
    }
  };

  const onAdd = async (userId: string) => {
    try {
      await api.addContact(userId);
      Alert.alert('Contact added', 'You can now chat with this contact');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unable to add contact';
      Alert.alert('Failed', msg);
    }
  };

  const renderRow = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Chat', { chatId: item.chatId, title: item.name })}>
      <Avatar uri={item.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name || 'User'}</Text>
        <Text style={styles.sub}>{item.status || ''}</Text>
      </View>
      <TouchableOpacity onPress={() => onAdd(item.id)}>
        <Text style={{ color: Colors.primary, fontWeight: '700' }}>Add</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Header title="Contacts" />
      <View style={styles.search}>
        <TextInput
          placeholder="Search users..."
          value={q}
          onChangeText={onSearch}
          style={styles.input}
          placeholderTextColor={Colors.mutedText}
        />
      </View>
      <FlatList<Contact>
        data={searchResults.length > 0 ? searchResults : contacts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderRow}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
};

export default ContactsScreen;

const styles = StyleSheet.create({
  search: { padding: 12, backgroundColor: Colors.surface },
  input: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  name: { fontSize: 16, fontWeight: '700', color: Colors.text },
  sub: { color: Colors.mutedText },
});
