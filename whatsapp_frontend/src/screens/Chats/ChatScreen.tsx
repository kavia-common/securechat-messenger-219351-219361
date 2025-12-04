import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Radius } from '../../theme/colors';
import { MessageBubble } from '../../components/MessageBubble';
import { api } from '../../api/client';
import { chatSocket } from '../../ws/chatSocket';
import { showMessageNotification } from '../../services/notifications';
import type { Message } from '../../types';

type Route = { params: { chatId: string } };
type Props = { route: Route };

const ChatScreen: React.FC<Props> = ({ route }) => {
  const { chatId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    (async () => {
      const data = await api.getMessages(chatId);
      setMessages(data);
      await chatSocket.connect();
      await chatSocket.joinConversation(chatId);
    })();
    return () => {
      chatSocket.leaveConversation(chatId);
    };
  }, [chatId]);

  useEffect(() => {
    const unsub = chatSocket.addListener((e) => {
      if (e.type === 'message' && e.chatId === chatId) {
        setMessages((prev) => [...prev, e.message]);
        showMessageNotification('New message', (e.message as any)?.content || 'You received a message');
        listRef.current?.scrollToEnd({ animated: true });
      }
    });
    return unsub;
  }, [chatId]);

  const onSendText = async () => {
    const content = text.trim();
    if (!content) return;
    setText('');
    const sentViaWs = await chatSocket.sendText(chatId, content);
    if (!sentViaWs) {
      const msg = await api.sendMessage(chatId, { type: 'text', content });
      setMessages((prev) => [...prev, msg]);
    }
    listRef.current?.scrollToEnd({ animated: true });
  };

  const onAttachImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      const asset = res.assets[0];
      const upload = await api.uploadMedia(asset.uri, asset.mimeType || 'image/jpeg');
      const msg = await api.sendMessage(chatId, { type: 'image', mediaUrl: upload.url });
      setMessages((prev) => [...prev, msg]);
      listRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MessageBubble
            isMine={!!(item as any).isMine}
            text={(item as any).type === 'text' ? item.content : undefined}
            mediaUrl={(item as any).type === 'image' ? (item as any).mediaUrl : undefined}
            time={(item as any).time}
            status={(item as any).status}
          />
        )}
        contentContainerStyle={{ paddingVertical: 8 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
      />
      <View style={styles.inputBar}>
        <TouchableOpacity onPress={onAttachImage} style={styles.iconBtn}>
          <Text style={{ color: Colors.secondary, fontSize: 20 }}>📎</Text>
        </TouchableOpacity>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          style={styles.input}
          placeholderTextColor={Colors.mutedText}
        />
        <TouchableOpacity onPress={onSendText} style={styles.sendBtn}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: 8,
  },
  iconBtn: {
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    color: Colors.text,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.md,
  },
});
