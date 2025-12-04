import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Shadows } from '../theme/colors';

type Props = {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
};

export const FAB: React.FC<Props> = ({ onPress, children, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.fab, style]}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
});
