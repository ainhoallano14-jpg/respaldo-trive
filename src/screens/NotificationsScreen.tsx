import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../theme/theme'
import { useAppStore } from '../store/useAppStore'
import { useNotifications } from '../hooks/useNotifications'
import { Notification } from '../hooks/useNotifications'

export default function NotificationsScreen() {
  const navigation = useNavigation()
  const { user } = useAppStore()
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead, deleteNotification, fetchNotifications } = useNotifications(user?.id)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchNotifications()
    setRefreshing(false)
  }

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId)
  }

  const handleDelete = (notificationId: string) => {
    Alert.alert('Eliminar', '¿Eliminar esta notificación?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => deleteNotification(notificationId),
      },
    ])
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return { name: 'checkmark-circle' as const, color: COLORS.primary }
      case 'trip_update':
        return { name: 'car' as const, color: COLORS.primary }
      case 'driver_arrived':
        return { name: 'navigate' as const, color: COLORS.accent }
      case 'trip_completed':
        return { name: 'flag' as const, color: COLORS.primary }
      case 'review_pending':
        return { name: 'star' as const, color: COLORS.accent }
      case 'message':
        return { name: 'mail' as const, color: COLORS.primary }
      default:
        return { name: 'notifications' as const, color: COLORS.primary }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `Hace ${diffMins}m`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays < 7) return `Hace ${diffDays}d`

    return date.toLocaleDateString('es-CO', {
      month: 'short',
      day: 'numeric',
    })
  }

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const icon = getNotificationIcon(item.type)
    return (
      <TouchableOpacity
        style={[styles.notificationCard, !item.is_read && styles.notificationUnread]}
        onPress={() => !item.is_read && handleMarkAsRead(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.notificationContent}>
          <View style={[styles.iconWrapper, { backgroundColor: icon.color + '20' }]}>
            <Ionicons name={icon.name} size={22} color={icon.color} />
          </View>
          <View style={styles.textWrapper}>
            <View style={styles.titleRow}>
              <Text style={styles.notificationTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.notificationTime}>{formatDate(item.created_at)}</Text>
            </View>
            <Text style={styles.notificationMessage} numberOfLines={2}>{item.message}</Text>
          </View>
          {!item.is_read && <View style={styles.unreadDot} />}
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="close" size={16} color={COLORS.textTertiary} />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <Ionicons name="notifications-off-outline" size={48} color={COLORS.textTertiary} />
      </View>
      <Text style={styles.emptyTitle}>Sin notificaciones</Text>
      <Text style={styles.emptyText}>Las notificaciones aparecerán aquí</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      {/* Fondo con círculos decorativos 3D */}
      <View style={styles.bgContainer}>
        <LinearGradient
          colors={[COLORS.primaryLight + '32', COLORS.primary + '16', COLORS.primaryDark + '06']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientCircle, styles.gradientCircle1]}
        />
        <LinearGradient
          colors={[COLORS.primaryLight + '25', COLORS.primary + '12', COLORS.primaryDark + '04']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientCircle, styles.gradientCircle2]}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Notificaciones</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAllAsRead}>
            <Ionicons name="checkmark-done" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Fondo con círculos decorativos 3D
  bgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientCircle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  gradientCircle1: {
    top: -100,
    right: -80,
    width: 280,
    height: 280,
  },
  gradientCircle2: {
    top: 150,
    left: -100,
    width: 340,
    height: 340,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  markAllBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },

  // Lista
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
    paddingTop: SPACING.md,
  },

  // Notification Card
  notificationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationUnread: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  notificationTitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  notificationTime: {
    ...TYPOGRAPHY.label,
    color: COLORS.textTertiary,
    marginLeft: 8,
  },
  notificationMessage: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  deleteBtn: {
    padding: 8,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
})
