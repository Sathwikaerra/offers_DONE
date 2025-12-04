// utils/haptics.ts
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function safeImpact(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) {
  if (Platform.OS !== 'web') {
    return Haptics.impactAsync(style);
  }
  return Promise.resolve(); // no-op on web
}
