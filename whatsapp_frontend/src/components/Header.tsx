import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Radius, Shadows } from '../theme/colors';

type Props = {
  title: string;
  rightActionIcon?: React.ReactNode;
  onRightActionPress?: () => void;
};

export const Header: React.FC<Props> = ({ title, rightActionIcon, onRightActionPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {rightActionIcon ? (
        <TouchableOpacity onPress={onRightActionPress} style={styles.action}>
          {rightActionIcon}
        </TouchableOpacity>
      ) : (
        <View style={styles.actionPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    ...Shadows.subtle,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  action: {
    position: 'absolute',
    right: 12,
    top: 56,
    padding: 8,
    borderRadius: Radius.md,
  },
  actionPlaceholder: {
    width: 1,
    height: 1,
  },
});
