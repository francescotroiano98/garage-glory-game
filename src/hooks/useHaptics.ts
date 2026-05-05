import { useCallback } from 'react';
import { Capacitor } from '@capacitor/core';

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

/**
 * Lightweight haptics wrapper. Uses Capacitor on native, falls back to
 * navigator.vibrate on web. No-op if neither is available.
 */
export function useHaptics() {
  const trigger = useCallback(async (style: HapticStyle = 'light') => {
    try {
      if (Capacitor.isNativePlatform()) {
        const { Haptics, ImpactStyle, NotificationType } = await import('@capacitor/haptics');
        switch (style) {
          case 'light':
            return Haptics.impact({ style: ImpactStyle.Light });
          case 'medium':
            return Haptics.impact({ style: ImpactStyle.Medium });
          case 'heavy':
            return Haptics.impact({ style: ImpactStyle.Heavy });
          case 'success':
            return Haptics.notification({ type: NotificationType.Success });
          case 'warning':
            return Haptics.notification({ type: NotificationType.Warning });
          case 'error':
            return Haptics.notification({ type: NotificationType.Error });
          case 'selection':
            return Haptics.selectionStart();
        }
      } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        const map: Record<HapticStyle, number | number[]> = {
          light: 8,
          medium: 18,
          heavy: 35,
          success: [12, 40, 18],
          warning: [20, 60, 20],
          error: [40, 30, 40, 30, 40],
          selection: 6,
        };
        navigator.vibrate(map[style]);
      }
    } catch {
      /* silent */
    }
  }, []);

  return { trigger };
}
