import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../theme/theme'

// Mock data - historial de viajes completados
const tripHistory = [
  {
    id: '1',
    origin: 'Cali',
    destination: 'Puerto Tejada',
    date: '2026-04-03',
    time: '14:30',
    seats: 2,
    price: 11000,
    status: 'completed',
    rating: 5,
    driver: 'Juan R.',
  },
  {
    id: '2',
    origin: 'Jamundí',
    destination: 'Cali',
    date: '2026-04-01',
    time: '08:00',
    seats: 1,
    price: 4200,
    status: 'completed',
    rating: 4,
    driver: 'María P.',
  },
  {
    id: '3',
    origin: 'Cali',
    destination: 'Yumbo',
    date: '2026-03-28',
    time: '17:00',
    seats: 1,
    price: 6000,
    status: 'cancelled',
    rating: null,
    driver: 'Carlos M.',
  },
]

export default function TripHistoryScreen() {
  const navigation = useNavigation()
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all')

  const filteredTrips = tripHistory.filter((trip) => {
    if (filter === 'all') return true
    if (filter === 'completed') return trip.status === 'completed'
    if (filter === 'cancelled') return trip.status === 'cancelled'
    return true
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-CO', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  }

  const handleRateTrip = (tripId: string) => {
    Alert.alert('Calificar viaje', '¿Cómo fue tu viaje?', [
      { text: '1', onPress: () => {} },
      { text: '2', onPress: () => {} },
      { text: '3', onPress: () => {} },
      { text: '4', onPress: () => {} },
      { text: '5', onPress: () => {} },
    ])
  }

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Historial de Viajes</Text>
            <Text style={styles.subtitle}>Tus viajes recientes</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {(['all', 'completed', 'cancelled'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? 'Todos' : f === 'completed' ? 'Completados' : 'Cancelados'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredTrips.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrapper}>
              <Ionicons name="receipt-outline" size={64} color={COLORS.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>Sin viajes</Text>
            <Text style={styles.emptyText}>
              {filter === 'all'
                ? 'Aún no tienes viajes realizados'
                : filter === 'completed'
                ? 'No hay viajes completados'
                : 'No hay viajes cancelados'}
            </Text>
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => navigation.navigate('Search' as never)}
            >
              <Ionicons name="search" size={20} color={COLORS.textInverse} />
              <Text style={styles.searchBtnText}>Buscar rutas</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            {filteredTrips.map((trip) => (
              <View key={trip.id} style={styles.tripCard}>
                <View style={styles.tripHeader}>
                  <View
                    style={[
                      styles.statusBadge,
                      trip.status === 'completed' ? styles.statusCompleted : styles.statusCancelled,
                    ]}
                  >
                    <Ionicons
                      name={trip.status === 'completed' ? 'checkmark-circle' : 'close-circle'}
                      size={14}
                      color={trip.status === 'completed' ? COLORS.success : COLORS.error}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: trip.status === 'completed' ? COLORS.success : COLORS.error },
                      ]}
                    >
                      {trip.status === 'completed' ? 'Completado' : 'Cancelado'}
                    </Text>
                  </View>
                  <Text style={styles.tripDate}>{formatDate(trip.date)}</Text>
                </View>

                <View style={styles.routeRow}>
                  <View style={styles.routePoint}>
                    <View style={styles.routeDot} />
                    <Text style={styles.routeText}>{trip.origin}</Text>
                  </View>
                  <View style={styles.routeArrow}>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.textTertiary} />
                  </View>
                  <View style={styles.routePoint}>
                    <View style={[styles.routeDot, styles.routeDotEnd]} />
                    <Text style={styles.routeText}>{trip.destination}</Text>
                  </View>
                </View>

                <View style={styles.tripDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.detailText}>{trip.time}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="person-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.detailText}>{trip.seats} asiento(s)</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="cash-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.detailText}>${trip.price.toLocaleString('es-CO')}</Text>
                  </View>
                </View>

                {trip.status === 'completed' && (
                  <View style={styles.tripFooter}>
                    <View style={styles.driverInfo}>
                      <Ionicons name="person" size={16} color={COLORS.textSecondary} />
                      <Text style={styles.driverText}>Conductor: {trip.driver}</Text>
                      {trip.rating && (
                        <View style={styles.ratingBadge}>
                          <Ionicons name="star" size={12} color={COLORS.warning} />
                          <Text style={styles.ratingText}>{trip.rating}</Text>
                        </View>
                      )}
                    </View>
                    {!trip.rating && (
                      <TouchableOpacity
                        style={styles.rateBtn}
                        onPress={() => handleRateTrip(trip.id)}
                      >
                        <Ionicons name="star-outline" size={16} color={COLORS.primary} />
                        <Text style={styles.rateBtnText}>Calificar</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.repeatBtn}
                  onPress={() => navigation.navigate('Main' as never, { screen: 'Search' } as never)}
                >
                  <Ionicons name="repeat" size={18} color={COLORS.primary} />
                  <Text style={styles.repeatBtnText}>Repetir ruta</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  filterTab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.textInverse,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: 60,
  },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
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
    marginBottom: SPACING.xl,
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
  },
  searchBtnText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textInverse,
    fontWeight: '600',
  },
  tripCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  statusCompleted: {
    backgroundColor: COLORS.success + '15',
  },
  statusCancelled: {
    backgroundColor: COLORS.error + '15',
  },
  statusText: {
    ...TYPOGRAPHY.label,
    fontWeight: '600',
  },
  tripDate: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  routeDotEnd: {
    backgroundColor: COLORS.accent,
  },
  routeText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  routeArrow: {
    paddingHorizontal: SPACING.md,
  },
  tripDetails: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  detailText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  driverText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  ratingText: {
    ...TYPOGRAPHY.label,
    color: COLORS.warning,
    fontWeight: '600',
  },
  rateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary + '15',
  },
  rateBtnText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.primary,
    fontWeight: '600',
  },
  repeatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  repeatBtnText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primary,
    fontWeight: '600',
  },
})
