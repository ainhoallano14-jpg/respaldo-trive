import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../theme/theme'

export default function RecentActivityScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  const activities = [
    {
      id: 1,
      action: 'Inicio de sesión',
      device: 'Android - Samsung Galaxy',
      location: 'Bogotá, Colombia',
      time: 'Hace 2 minutos',
      icon: 'log-in-outline',
      status: 'exitoso',
    },
    {
      id: 2,
      action: 'Cambio de contraseña',
      device: 'Chrome - Escritorio',
      location: 'Bogotá, Colombia',
      time: 'Ayer a las 3:45 PM',
      icon: 'lock-closed-outline',
      status: 'exitoso',
    },
    {
      id: 3,
      action: 'Intento de inicio fallido',
      device: 'Dirección IP desconocida',
      location: 'Medellín, Colombia',
      time: 'Hace 5 días',
      icon: 'alert-outline',
      status: 'fallido',
    },
    {
      id: 4,
      action: 'Cambio de correo',
      device: 'iPhone 13 - iOS',
      location: 'Bogotá, Colombia',
      time: 'Hace 1 semana',
      icon: 'mail-outline',
      status: 'exitoso',
    },
    {
      id: 5,
      action: 'Inicio de sesión',
      device: 'Android - Samsung Galaxy',
      location: 'Cali, Colombia',
      time: 'Hace 2 semanas',
      icon: 'log-in-outline',
      status: 'exitoso',
    },
  ]

  const getActivityColor = (status: string) => {
    return status === 'exitoso' ? COLORS.primary : COLORS.error
  }

  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Actividad Reciente</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>
            {activities.length} actividad{activities.length > 1 ? 'es' : ''} registrada{activities.length > 1 ? 's' : ''}
          </Text>

          {activities.map((activity, index) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: getActivityColor(activity.status) + '15' },
                  ]}
                >
                  <Ionicons
                    name={activity.icon as any}
                    size={20}
                    color={getActivityColor(activity.status)}
                  />
                </View>

                <View style={styles.activityInfo}>
                  <Text style={styles.actionText}>{activity.action}</Text>
                  <Text style={styles.deviceText}>{activity.device}</Text>
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color={COLORS.textTertiary} />
                    <Text style={styles.locationText}>{activity.location}</Text>
                  </View>
                </View>

                <View style={styles.rightContent}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getActivityColor(activity.status) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getActivityColor(activity.status) },
                      ]}
                    >
                      {activity.status === 'exitoso' ? '✓' : '!'}
                    </Text>
                  </View>
                  <Text style={styles.timeText}>{activity.time}</Text>
                </View>
              </View>

              {index !== activities.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <View style={styles.securityNote}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.noteText}>
            Si ve actividad inusual, cambie su contraseña inmediatamente y revise sus dispositivos conectados
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionSubtitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  activityInfo: {
    flex: 1,
    gap: SPACING.xs,
  },
  actionText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  deviceText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  locationText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
  },
  rightContent: {
    alignItems: 'flex-end',
    gap: SPACING.xs,
  },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontWeight: '700',
    fontSize: 16,
  },
  timeText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: SPACING.lg,
  },
  securityNote: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.primary + '10',
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  noteText: {
    flex: 1,
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
})
