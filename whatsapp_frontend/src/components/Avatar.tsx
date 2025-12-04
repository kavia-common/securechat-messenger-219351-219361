import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

type Props = {
  uri?: string;
  size?: number;
};

export const Avatar: React.FC<Props> = ({ uri, size = 44 }) => {
  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  return <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]} />;
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: Colors.border,
  },
});
