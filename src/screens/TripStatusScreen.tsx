import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../theme/theme'
import { useAppStore } from '../store/useAppStore'
import { useBookings } from '../hooks/useBookings'

export default function TripStatusScreen() {
  const navigation = useNavigation()
  const { selectedRoute, selectedSeat } = useAppStore()
  const { getRouteBookings, loading } = useBookings()
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    if (!selectedRoute) {
      navigation.goBack()
      return
    }
    loadBookings()
  }, [selectedRoute])

  const loadBookings = async () => {
    try {
      const routeBookings = await getRouteBookings(selectedRoute!.id)
      setBookings(routeBookings)
    } catch (error) {
      console.log('Error loading bookings:', error)
    }
  }

  if (!selectedRoute) return null

  const occupiedSeats = bookings.length
  const totalSeats = selectedRoute.total_seats || 5
  const availableSeats = totalSeats - occupiedSeats

  const departureTime = new Date(selectedRoute.departure_time).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const departureDate = new Date(selectedRoute.departure_time).toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  const driverInitial = selectedRoute.driver_name?.charAt(0).toUpperCase() || 'C'

  // Generate all seat statuses
  const occupiedSeatNumbers = new Set(bookings.map((b: any) => b.seat_number))
  const allSeats = Array.from({ length: totalSeats }, (_, i) => ({
    id: i + 1,
    status:
      occupiedSeatNumbers.has(i + 1) ? 'occupied' : selectedSeat === i + 1 ? 'selected' : 'available',
  }))

  const occupiedPercentage = (occupiedSeats / totalSeats) * 100

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Estado del Viaje</Text>
            <Text style={styles.subtitle}>Viaje programado</Text>
          </View>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('Home' as never)}
          >
            <Ionicons name="home" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <>
            {/* Status Card */}
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <View style={styles.statusBadge}>
                  <Ionicons name="time" size={14} color={COLORS.primary} />
                  <Text style={styles.statusBadgeText}>En espera</Text>
                </View>
                <Text style={styles.tripTime}>Salida en 15 min</Text>
              </View>

              <View style={styles.routeDisplay}>
                <View style={styles.routePoint}>
                  <View style={styles.routeDotLarge} />
                  <Text style={styles.routeCity}>{selectedRoute.origin}</Text>
                </View>
                <View style={styles.routeArrow}>
                  <View style={styles.routeLine} />
                  <Ionicons name="airplane" size={16} color={COLORS.primary} />
                  <View style={styles.routeLine} />
                </View>
                <View style={styles.routePoint}>
                  <View style={[styles.routeDotLarge, styles.routeDotEnd]} />
                  <Text style={styles.routeCity}>{selectedRoute.destination}</Text>
                </View>
              </View>
            </View>

            {/* Seats Card */}
            <View style={styles.seatsCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Cupos del vehículo</Text>
                <Text style={styles.seatsSubtitle}>
                  {availableSeats} de {totalSeats} disponibles
                </Text>
              </View>

              <View style={styles.seatsGrid}>
                {allSeats.map((seat) => (
                  <View key={seat.id} style={styles.seatItem}>
                    <View
                      style={[
                        styles.seatCircle,
                        seat.status === 'occupied' && styles.seatOccupied,
                        seat.status === 'available' && styles.seatAvailable,
                        seat.status === 'selected' && styles.seatSelected,
                      ]}
                    >
                      {seat.status === 'occupied' ? (
                        <Ionicons name="person" size={14} color="#fff" />
                      ) : (
                        <Text
                          style={[
                            styles.seatNumber,
                            seat.status === 'selected' && styles.seatNumberSelected,
                          ]}
                        >
                          {seat.id}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.seatLabel}>
                      {seat.status === 'occupied'
                        ? 'Ocupado'
                        : seat.status === 'selected'
                        ? 'Tu asiento'
                        : 'Libre'}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${occupiedPercentage}%` }]} />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressText}>{occupiedSeats} ocupados</Text>
                  <Text style={styles.progressText}>{availableSeats} disponibles</Text>
                </View>
              </View>
            </View>

            {/* Vehicle Card */}
            <View style={styles.vehicleCard}>
              <View style={styles.vehicleHeader}>
                <View>
                  <Text style={styles.vehicleName}>{selectedRoute.vehicle_model || 'Vehículo'}</Text>
                  <Text style={styles.vehicleDetails}>
                    {selectedRoute.license_plate} · {selectedRoute.vehicle_color}
                  </Text>
                </View>
                <View style={styles.vehicleBadge}>
                  <Ionicons name="car" size={20} color={COLORS.primary} />
                </View>
              </View>

              <View style={styles.driverRow}>
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverInitial}>{driverInitial}</Text>
                </View>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{selectedRoute.driver_name || 'Conductor'}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color={COLORS.accent} />
                    <Text style={styles.ratingText}>{selectedRoute.driver_rating || '0'}</Text>
                    <Text style={styles.ratingLabel}> ·conductor verificado</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.callBtn}>
                  <Ionicons name="call" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.messageBtn}>
                  <Ionicons name="chatbubble" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Trip Info Card */}
            <View style={styles.tripInfoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
                  <Text style={styles.infoLabel}>Hora</Text>
                  <Text style={styles.infoValue}>{departureTime}</Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoItem}>
                  <Ionicons name="cash-outline" size={20} color={COLORS.textSecondary} />
                  <Text style={styles.infoLabel}>Tarifa</Text>
                  <Text style={styles.infoValue}>${selectedRoute.price_per_seat?.toLocaleString('es-CO')}</Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoItem}>
                  <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />
                  <Text style={styles.infoLabel}>Fecha</Text>
                  <Text style={styles.infoValue}>{departureDate}</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={styles.newTripBtn}
              onPress={() => navigation.navigate('Search' as never)}
              activeOpacity={0.8}
            >
              <Ionicons name="search" size={20} color={COLORS.primary} />
              <Text style={styles.newTripBtnText}>Buscar nuevas rutas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn}>
              <Ionicons name="close-circle-outline" size={20} color={COLORS.error} />
              <Text style={styles.cancelBtnText}>Cancelar Reserva</Text>
            </TouchableOpacity>
          </>
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
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  homeBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },

  // Status Card
  statusCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
    borderTopColor: COLORS.shadowWhiteLight,
    borderTopWidth: 1.5,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    gap: SPACING.xs,
  },
  statusBadgeText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.primary,
    fontWeight: '600',
  },
  tripTime: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  routeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  routePoint: {
    alignItems: 'center',
  },
  routeDotLarge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  routeDotEnd: {
    backgroundColor: COLORS.accent,
  },
  routeArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  routeLine: {
    width: 30,
    height: 2,
    backgroundColor: COLORS.borderLight,
  },
  routeCity: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },

  // Seats Card
  seatsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
  },
  seatsSubtitle: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
  },
  seatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  seatItem: {
    alignItems: 'center',
    width: 60,
  },
  seatCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  seatOccupied: {
    backgroundColor: COLORS.textSecondary,
  },
  seatAvailable: {
    backgroundColor: COLORS.primary,
  },
  seatSelected: {
    backgroundColor: COLORS.success,
    borderWidth: 3,
    borderColor: COLORS.accent,
  },
  seatNumber: {
    ...TYPOGRAPHY.bodyMedium,
    color: '#fff',
    fontWeight: '700',
  },
  seatNumberSelected: {
    color: '#fff',
  },
  seatLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: SPACING.sm,
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  progressText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
  },

  // Vehicle Card
  vehicleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  vehicleName: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  vehicleDetails: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  vehicleBadge: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverInitial: {
    ...TYPOGRAPHY.h4,
    color: '#fff',
    fontWeight: '700',
  },
  driverInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  driverName: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.accent,
    fontWeight: '600',
    marginLeft: 4,
  },
  ratingLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },

  // Trip Info Card
  tripInfoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    ...SHADOWS.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoDivider: {
    width: 1,
    backgroundColor: COLORS.borderLight,
  },
  infoLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  infoValue: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },

  // Action Buttons
  newTripBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    height: 52,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  newTripBtnText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primary,
    fontWeight: '700',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    gap: SPACING.xs,
  },
  cancelBtnText: {
    ...TYPOGRAPHY.body,
    color: COLORS.error,
    fontWeight: '600',
  },
})
