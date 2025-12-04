export const Colors = {
  primary: '#2563EB',
  secondary: '#F59E0B',
  success: '#F59E0B',
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  mutedText: '#6B7280',
  border: '#E5E7EB',
  bubbleIncoming: '#FFFFFF',
  bubbleOutgoing: '#DBEAFE',
  link: '#2563EB',
};

export const Shadows = {
  subtle: {
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const Theme = {
  name: 'Ocean Professional',
  colors: Colors,
  shadows: Shadows,
  radius: Radius,
};
