import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Platform,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, RADIUS, SPACING, SHADOWS } from '../theme/theme'

interface ToastProps {
  visible: boolean
  message: string
  type: 'success' | 'error' | 'info'
  onHide: () => void
  duration?: number
}

export default function Toast({
  visible,
  message,
  type,
  onHide,
  duration = 3000,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-150)).current
  const opacity = useRef(new Animated.Value(0)).current
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (visible) {
      StatusBar.setBarStyle('light-content')
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -150,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          StatusBar.setBarStyle('dark-content')
          onHide()
        })
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [visible, duration, onHide, translateY, opacity])

  if (!visible) return null

  const config = {
    success: {
      icon: 'checkmark-circle' as const,
      color: COLORS.success,
      bg: '#0D3A88',
    },
    error: {
      icon: 'close-circle' as const,
      color: COLORS.error,
      bg: '#1A1A2E',
    },
    info: {
      icon: 'information-circle' as const,
      color: COLORS.info,
      bg: '#0D3A88',
    },
  }

  const { icon, color, bg } = config[type]

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          transform: [{ translateY }],
          opacity,
          paddingTop: insets.top + SPACING.sm,
        },
      ]}
    >
      <StatusBar backgroundColor={bg} barStyle="light-content" />
      <View style={styles.content}>
        <Ionicons name={icon} size={22} color={color} />
        <Text style={styles.message}>{message}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { backgroundColor: color }]} />
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progress: {
    height: '100%',
    width: '100%',
  },
})
