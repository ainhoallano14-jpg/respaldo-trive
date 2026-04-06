import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../theme/theme'
import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function HomeScreen() {
  const navigation = useNavigation()
  const [transportType, setTransportType] = useState<'car' | 'taxi' | 'bus' | 'bike'>('car')
  const [destination, setDestination] = useState('')
  const balance = useAppStore((state) => state.balance)
  const setBalance = useAppStore((state) => state.setBalance)

  const handleAddCredit = () => {
    setBalance(balance + 10000)
  }

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      {/* Fondo con círculos decorativos */}
      <View style={styles.gradientBg}>
        <View style={styles.gradientCircle1} />
        <View style={styles.gradientCircle2} />
        <View style={styles.gradientCircle3} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.logo}>Trive</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => navigation.navigate('Notifications' as never)}
            activeOpacity={0.85}
          >
            <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <Pressable
          style={({ pressed }) => [
            styles.balanceCard,
            pressed && styles.balanceCardPressed,
          ]}
          onPress={handleAddCredit}
        >
          <View style={styles.balanceCardBg} />
          <View style={styles.balanceContent}>
            <View style={styles.balanceLeft}>
              <Text style={styles.balanceLabel}>Saldo disponible</Text>
              <Text style={styles.balanceAmount}>${balance.toLocaleString('es-CO')}</Text>
            </View>
            <View style={styles.addBalanceBtn}>
              <Ionicons name="add" size={20} color={COLORS.primary} />
            </View>
          </View>
          <View style={styles.balanceFooter}>
            <View style={styles.balanceChip}>
              <Text style={styles.balanceChipText}>TRIVE</Text>
            </View>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceCardNumber}>•••• •••• •••• 4523</Text>
              <View style={styles.balanceVerified}>
                <Ionicons name="checkmark-circle" size={11} color={COLORS.textInverse} />
                <Text style={styles.balanceVerifiedText}>Verificado</Text>
              </View>
            </View>
          </View>
        </Pressable>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>¿A dónde vas?</Text>

          <View style={styles.searchCard}>
            <View style={styles.searchRow}>
              <View style={styles.searchPoints}>
                <View style={styles.pointDotBlue} />
                <View style={styles.pointLine} />
              </View>
              <View style={styles.searchInputContainer}>
                <Text style={styles.searchLabel}>Desde</Text>
                <View style={styles.searchValueRow}>
                  <Ionicons name="locate" size={14} color={COLORS.primary} />
                  <Text style={styles.searchValue} numberOfLines={1}>Mi ubicación actual</Text>
                </View>
              </View>
            </View>

            <View style={styles.searchRowTo}>
              <View style={styles.searchPointsTo}>
                <View style={styles.pointDotOrange} />
              </View>
              <View style={styles.searchInputContainer}>
                <Text style={styles.searchLabel}>Hacia</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Ej: Cali, Puerto Tejada..."
                  placeholderTextColor={COLORS.textTertiary}
                  value={destination}
                  onChangeText={setDestination}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.searchBtn, !destination && styles.searchBtnDisabled]}
            disabled={!destination}
            onPress={() => navigation.navigate('Search' as never)}
            activeOpacity={0.85}
          >
            <Ionicons name="search" size={20} color={destination ? COLORS.textInverse : COLORS.textSecondary} />
            <Text style={[styles.searchBtnText, !destination && styles.searchBtnTextDisabled]}>
              Buscar rutas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transport Type Selector */}
        <View style={styles.transportSection}>
          <Text style={styles.sectionTitle}>Tipo de transporte</Text>
          <View style={styles.transportRow}>
            {(['car', 'taxi', 'bus', 'bike'] as const).map((type) => {
              const isActive = transportType === type
              const icons: Record<string, string> = {
                car: 'car',
                taxi: 'car-outline',
                bus: 'bus',
                bike: 'bicycle-outline',
              }
              const labels: Record<string, string> = {
                car: 'Auto',
                taxi: 'Taxi',
                bus: 'Bus',
                bike: 'Moto',
              }

              return (
                <Pressable
                  key={type}
                  style={[styles.transportItem, isActive && styles.transportItemActive]}
                  onPress={() => setTransportType(type)}
                >
                  <View style={[styles.transportIcon, isActive && styles.transportIconActive]}>
                    <Ionicons
                      name={icons[type] as any}
                      size={20}
                      color={isActive ? COLORS.textInverse : COLORS.primary}
                    />
                  </View>
                  <Text style={[styles.transportLabel, isActive && styles.transportLabelActive]} numberOfLines={1}>
                    {labels[type]}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('ScheduledTrips' as never)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.primary + '20' }]}>
              <Ionicons name="time-outline" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.quickActionText} numberOfLines={1}>Programar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('GroupTrips' as never)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.accent + '20' }]}>
              <Ionicons name="people-outline" size={18} color={COLORS.accent} />
            </View>
            <Text style={styles.quickActionText} numberOfLines={1}>Grupal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('FavoriteRoutes' as never)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.success + '20' }]}>
              <Ionicons name="heart-outline" size={18} color={COLORS.success} />
            </View>
            <Text style={styles.quickActionText} numberOfLines={1}>Favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('TripHistory' as never)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.warning + '20' }]}>
              <Ionicons name="receipt-outline" size={18} color={COLORS.warning} />
            </View>
            <Text style={styles.quickActionText} numberOfLines={1}>Historial</Text>
          </TouchableOpacity>
        </View>

        {/* Routes Section */}
        <View style={styles.routesSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Rutas disponibles</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search' as never)}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {/* Route Card 1 */}
          <TouchableOpacity
            style={styles.routeCard}
            onPress={() => navigation.navigate('SeatSelection' as never)}
            activeOpacity={0.85}
          >
            <View style={styles.routeTop}>
              <View style={styles.routeLeft}>
                <View style={styles.routeLocationRow}>
                  <View style={styles.routeDotGreen} />
                  <Text style={styles.routeOrigin} numberOfLines={1}>Puerto Tejada → Cali</Text>
                </View>
                <Text style={styles.routeTime}>Hoy · 2:30 PM</Text>
              </View>
              <View style={styles.routeRight}>
                <Text style={styles.routePrice}>$5.500</Text>
                <Text style={styles.routePricePer}>/asiento</Text>
              </View>
            </View>

            <View style={styles.routeDivider} />

            <View style={styles.routeBottom}>
              <View style={styles.routeMeta}>
                <View style={styles.routeMetaItem}>
                  <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} />
                  <Text style={styles.routeMetaText}>45 min</Text>
                </View>
                <View style={styles.routeMetaItem}>
                  <Ionicons name="car-outline" size={13} color={COLORS.textSecondary} />
                  <Text style={styles.routeMetaText} numberOfLines={1}>Toyota Gris</Text>
                </View>
              </View>

              <View style={styles.routeDriver}>
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverInitials}>JR</Text>
                </View>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName} numberOfLines={1}>Juan R.</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={10} color={COLORS.accent} />
                    <Text style={styles.ratingText}>4.8</Text>
                  </View>
                </View>
                <View style={styles.seatsBadge}>
                  <Text style={styles.seatsText}>3</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Route Card 2 */}
          <TouchableOpacity
            style={styles.routeCard}
            onPress={() => navigation.navigate('SeatSelection' as never)}
            activeOpacity={0.85}
          >
            <View style={styles.routeTop}>
              <View style={styles.routeLeft}>
                <View style={styles.routeLocationRow}>
                  <View style={styles.routeDotGreen} />
                  <Text style={styles.routeOrigin} numberOfLines={1}>Jamundí → Cali</Text>
                </View>
                <Text style={styles.routeTime}>Hoy · 3:00 PM</Text>
              </View>
              <View style={styles.routeRight}>
                <Text style={styles.routePrice}>$4.200</Text>
                <Text style={styles.routePricePer}>/asiento</Text>
              </View>
            </View>

            <View style={styles.routeDivider} />

            <View style={styles.routeBottom}>
              <View style={styles.routeMeta}>
                <View style={styles.routeMetaItem}>
                  <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} />
                  <Text style={styles.routeMetaText}>35 min</Text>
                </View>
                <View style={styles.routeMetaItem}>
                  <Ionicons name="car-outline" size={13} color={COLORS.textSecondary} />
                  <Text style={styles.routeMetaText} numberOfLines={1}>Honda Negro</Text>
                </View>
              </View>

              <View style={styles.routeDriver}>
                <View style={[styles.driverAvatar, { backgroundColor: COLORS.accent }]}>
                  <Text style={styles.driverInitials}>MP</Text>
                </View>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName} numberOfLines={1}>María P.</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={10} color={COLORS.accent} />
                    <Text style={styles.ratingText}>4.9</Text>
                  </View>
                </View>
                <View style={[styles.seatsBadge, { backgroundColor: COLORS.success + '20' }]}>
                  <Text style={[styles.seatsText, { color: COLORS.success }]}>5</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Fondo con círculos decorativos
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientCircle1: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: COLORS.primary,
    opacity: 0.12,
  },
  gradientCircle2: {
    position: 'absolute',
    top: 180,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: COLORS.primary,
    opacity: 0.08,
  },
  gradientCircle3: {
    position: 'absolute',
    top: 420,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.accent,
    opacity: 0.06,
  },

  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  logo: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationCount: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },

  // Balance Card
  balanceCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  balanceCardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.2,
  },
  balanceCardBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primary,
  },
  balanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SPACING.lg,
    paddingTop: 24,
  },
  balanceLeft: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textInverse + '85',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textInverse,
    letterSpacing: -1,
  },
  addBalanceBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  balanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: 12,
  },
  balanceChip: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  balanceChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceCardNumber: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textInverse + '85',
    letterSpacing: 2,
  },
  balanceVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  balanceVerifiedText: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.textInverse + '75',
  },

  // Search Section
  searchSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  searchCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  searchRowTo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  searchPoints: {
    alignItems: 'center',
    marginRight: 12,
  },
  searchPointsTo: {
    marginRight: 12,
    marginTop: 6,
  },
  pointDotBlue: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  pointDotOrange: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
  },
  pointLine: {
    width: 2,
    height: 26,
    backgroundColor: COLORS.borderLight,
    marginTop: 4,
    marginLeft: 4,
  },
  searchInputContainer: {
    flex: 1,
  },
  searchLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  searchValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  searchValue: {
    fontSize: 15,
    color: COLORS.textPrimary,
    flex: 1,
  },
  searchInput: {
    fontSize: 15,
    color: COLORS.textPrimary,
    padding: 0,
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  searchBtnDisabled: {
    backgroundColor: COLORS.surfaceAlt,
  },
  searchBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textInverse,
  },
  searchBtnTextDisabled: {
    color: COLORS.textSecondary,
  },

  // Transport Section
  transportSection: {
    marginBottom: SPACING.xl,
  },
  transportRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: 10,
  },
  transportItem: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  transportItemActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 12,
  },
  transportIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: COLORS.primary + '40',
  },
  transportIconActive: {
    backgroundColor: COLORS.accent,
    borderColor: 'transparent',
  },
  transportLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  transportLabelActive: {
    color: COLORS.textInverse,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: 10,
  },
  quickActionItem: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  quickActionIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },

  // Routes Section
  routesSection: {
    paddingHorizontal: SPACING.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Route Card
  routeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 12,
  },
  routeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  routeLeft: {
    flex: 1,
    marginRight: 12,
  },
  routeLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  routeOrigin: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  routeTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginLeft: 14,
  },
  routeRight: {
    alignItems: 'flex-end',
  },
  routePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  routePricePer: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
  routeDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 12,
  },
  routeBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeMeta: {
    flexDirection: 'row',
    gap: 14,
  },
  routeMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  routeMetaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  routeDriver: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  driverAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary + '50',
  },
  driverInitials: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textInverse,
  },
  driverInfo: {
    marginRight: 2,
  },
  driverName: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.accent,
  },
  seatsBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatsText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
})
