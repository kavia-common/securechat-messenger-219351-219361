import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors, Radius } from '../theme/colors';

type Props = {
  isMine: boolean;
  text?: string;
  mediaUrl?: string;
  time?: string;
  status?: 'sent' | 'delivered' | 'read';
};

export const MessageBubble: React.FC<Props> = ({ isMine, text, mediaUrl, time, status }) => {
  return (
    <View style={[styles.row, isMine ? styles.right : styles.left]}>
      <View style={[styles.bubble, isMine ? styles.mine : styles.theirs]}>
        {mediaUrl ? (
          <Image source={{ uri: mediaUrl }} style={styles.image} resizeMode="cover" />
        ) : null}
        {!!text && <Text style={[styles.text, isMine ? styles.textMine : styles.textTheirs]}>{text}</Text>}
        <View style={styles.metaRow}>
          {!!time && <Text style={styles.time}>{time}</Text>}
          {!!status && isMine && <Text style={styles.status}> • {status}</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: '100%',
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  left: { alignItems: 'flex-start' },
  right: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '85%',
    borderRadius: Radius.lg,
    padding: 10,
  },
  mine: { backgroundColor: Colors.bubbleOutgoing, borderTopRightRadius: Radius.sm },
  theirs: { backgroundColor: Colors.bubbleIncoming, borderTopLeftRadius: Radius.sm },
  text: { fontSize: 16 },
  textMine: { color: Colors.text },
  textTheirs: { color: Colors.text },
  metaRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  time: { fontSize: 11, color: Colors.mutedText },
  status: { fontSize: 11, color: Colors.mutedText },
  image: { width: 180, height: 180, borderRadius: Radius.md, marginBottom: 8, backgroundColor: '#e5e7eb' },
});
