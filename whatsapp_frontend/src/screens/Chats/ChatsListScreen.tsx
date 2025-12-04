import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { Colors } from '../../theme/colors';
import { api } from '../../api/client';
import { Avatar } from '../../components/Avatar';
import { FAB } from '../../components/FAB';
import { Header } from '../../components/Header';
import type { Chat } from '../../types';

type Nav = { addListener: (evt: 'focus', cb: () => void) => () => void; navigate: (name: string, params?: Record<string, unknown>) => void };
type Props = { navigation: Nav };

const ChatsListScreen: React.FC<Props> = ({ navigation }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await api.listChats();
      setChats(data);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation, load]);

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Chat', { chatId: item.id, title: item.title || 'Chat' })}>
      <Avatar uri={item.avatar} />
      <View style={styles.itemCenter}>
        <Text style={styles.name}>{item.title || 'Chat'}</Text>
        <Text style={styles.preview} numberOfLines={1}>{item.lastMessage?.content || 'No messages yet'}</Text>
      </View>
      <Text style={styles.time}>{item.lastMessage?.time || ''}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Chats" />
      <FlatList<Chat>
        data={chats}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        contentContainerStyle={{ paddingBottom: 96 }}
      />
      <FAB onPress={() => navigation.navigate('Contacts')}>
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 22 }}>+</Text>
      </FAB>
    </View>
  );
};

export default ChatsListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  itemCenter: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  preview: { color: Colors.mutedText },
  time: { color: Colors.mutedText, fontSize: 12 },
});
