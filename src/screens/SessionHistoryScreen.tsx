import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../theme/theme'

export default function SessionHistoryScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  const activeSessions = [
    {
      id: 1,
      device: 'Android - Samsung Galaxy',
      lastActive: 'Hace 2 minutos',
      location: 'Bogotá, Colombia',
      isCurrent: true,
    },
    {
      id: 2,
      device: 'iPhone 13 - iOS',
      lastActive: 'Ayer a las 10:30 AM',
      location: 'Medellín, Colombia',
      isCurrent: false,
    },
    {
      id: 3,
      device: 'Chrome - Escritorio',
      lastActive: 'Hace 3 días',
      location: 'Bogotá, Colombia',
      isCurrent: false,
    },
  ]

  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Dispositivos Conectados</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>
            {activeSessions.length} dispositivo{activeSessions.length > 1 ? 's' : ''} conectado{activeSessions.length > 1 ? 's' : ''}
          </Text>

          {activeSessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View>
                  <Text style={styles.deviceName}>{session.device}</Text>
                  {session.isCurrent && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>Actual</Text>
                    </View>
                  )}
                </View>
                {!session.isCurrent && (
                  <TouchableOpacity style={styles.logoutBtn}>
                    <Text style={styles.logoutBtnText}>Cerrar sesión</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.sessionDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>{session.lastActive}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>{session.location}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Si no reconoces algún dispositivo, cierra la sesión y cambia tu contraseña
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
  sessionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  deviceName: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  currentBadge: {
    backgroundColor: COLORS.primary + '20',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginTop: SPACING.xs,
  },
  currentBadgeText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
  },
  logoutBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.error + '15',
  },
  logoutBtnText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.error,
    fontWeight: '600',
  },
  sessionDetails: {
    gap: SPACING.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detailText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  infoBox: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.primary + '10',
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  infoText: {
    flex: 1,
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
})
