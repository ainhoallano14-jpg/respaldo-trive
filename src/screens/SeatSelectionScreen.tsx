import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../theme/theme'
import { useAppStore } from '../store/useAppStore'
import { useBookings } from '../hooks/useBookings'

export default function SeatSelectionScreen() {
  const navigation = useNavigation()
  const { selectedRoute, setBookingData } = useAppStore()
  const { getRouteBookings, loading } = useBookings()
  const [bookings, setBookings] = useState<any[]>([])
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    if (!selectedRoute) {
      Alert.alert('Error', 'No hay ruta seleccionada', [
        { text: 'Aceptar', onPress: () => navigation.goBack() }
      ])
      return
    }
    loadBookings()
  }, [selectedRoute?.id])

  const loadBookings = async () => {
    try {
      setInitialLoading(true)
      const routeBookings = await getRouteBookings(selectedRoute!.id)
      setBookings(routeBookings)
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setInitialLoading(false)
    }
  }

  if (!selectedRoute) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    )
  }

  const occupiedSeats = new Set(bookings.map((b: any) => b.seat_number))
  const totalSeats = selectedRoute.total_seats || 5
  const availableSeatsCount = totalSeats - occupiedSeats.size

  // Generate seat array
  const seatsArray = Array.from({ length: totalSeats }, (_, i) => {
    const seatId = i + 1
    return {
      id: seatId,
      available: !occupiedSeats.has(seatId),
    }
  })

  const toggleSeat = (seatId: number) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId)
      } else {
        return [...prev, seatId].sort((a, b) => a - b)
      }
    })
  }

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('Error', 'Selecciona al menos un asiento')
      return
    }

    const totalPrice = selectedSeats.length * selectedRoute.price_per_seat

    setBookingData({
      route_id: selectedRoute.id,
      seat_numbers: selectedSeats,
      total_seats: selectedSeats.length,
      price_per_seat: selectedRoute.price_per_seat,
      total_price: totalPrice,
      origin: selectedRoute.origin,
      destination: selectedRoute.destination,
      departure_time: selectedRoute.departure_time,
      driver_name: selectedRoute.driver_name,
      vehicle_info: `${selectedRoute.vehicle_make} ${selectedRoute.vehicle_color}`,
      license_plate: selectedRoute.license_plate,
    })

    navigation.navigate('Booking' as never)
  }

  const departureDate = new Date(selectedRoute.departure_time)
  const formattedDate = departureDate.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  const departureTime = departureDate.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const driverInitial = selectedRoute.driver_name?.charAt(0).toUpperCase() || 'C'

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Selecciona tus asientos</Text>
            <Text style={styles.subtitle}>Toca los asientos disponibles</Text>
          </View>
        </View>

        {initialLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <>
            {/* Vehicle Card */}
            <View style={styles.vehicleCard}>
              <View style={styles.vehicleHeader}>
                <View>
                  <Text style={styles.vehicleName}>{selectedRoute.vehicle_make || 'Vehículo'}</Text>
                  <Text style={styles.vehicleDetails}>
                    {selectedRoute.vehicle_year} · {selectedRoute.vehicle_color}
                  </Text>
                </View>
                <View style={styles.plateBadge}>
                  <Text style={styles.plateText}>{selectedRoute.license_plate || '---'}</Text>
                </View>
              </View>

              {/* Seats Grid */}
              <View style={styles.seatsSection}>
                {/* Driver seat */}
                <View style={styles.driverSeatRow}>
                  <View style={styles.driverSeat}>
                    <Ionicons name="person" size={20} color={COLORS.textTertiary} />
                    <Text style={styles.driverLabel}>Chofer</Text>
                  </View>
                </View>

                {/* Passenger seats */}
                <View style={styles.seatsGrid}>
                  {seatsArray.map((seat) => {
                    const isSelected = selectedSeats.includes(seat.id)
                    const isOccupied = !seat.available

                    return (
                      <TouchableOpacity
                        key={seat.id}
                        style={[
                          styles.seat,
                          isOccupied && styles.seatOccupied,
                          isSelected && styles.seatSelected,
                        ]}
                        disabled={isOccupied}
                        onPress={() => toggleSeat(seat.id)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.seatText,
                            isOccupied && styles.seatTextOccupied,
                            isSelected && styles.seatTextSelected,
                          ]}
                        >
                          {seat.id}
                        </Text>
                        {isOccupied && (
                          <View style={styles.occupiedOverlay}>
                            <Ionicons name="close" size={14} color={COLORS.textTertiary} />
                          </View>
                        )}
                      </TouchableOpacity>
                    )
                  })}
                </View>

                {/* Legend */}
                <View style={styles.legend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
                    <Text style={styles.legendText}>Disponible</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
                    <Text style={styles.legendText}>Seleccionado</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: COLORS.surfaceAlt }]} />
                    <Text style={styles.legendText}>Ocupado</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Selected Seats Counter */}
            <View style={[styles.selectionCard, selectedSeats.length > 0 && styles.selectionCardActive]}>
              <View style={styles.selectionInfo}>
                <View style={[styles.selectionIcon, selectedSeats.length > 0 && styles.selectionIconActive]}>
                  <Ionicons
                    name={selectedSeats.length > 0 ? 'checkmark' : 'information-circle'}
                    size={20}
                    color={selectedSeats.length > 0 ? '#fff' : COLORS.textSecondary}
                  />
                </View>
                <View>
                  <Text style={[styles.selectionTitle, selectedSeats.length > 0 && styles.selectionTitleActive]}>
                    {selectedSeats.length === 0
                      ? 'Sin asientos seleccionados'
                      : selectedSeats.length === 1
                      ? '1 asiento seleccionado'
                      : `${selectedSeats.length} asientos seleccionados`}
                  </Text>
                  <Text style={styles.selectionSubtitle}>
                    {selectedSeats.length > 0
                      ? `Asientos: ${selectedSeats.join(', ')}`
                      : 'Toca los asientos disponibles'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Trip Card */}
            <View style={styles.tripCard}>
              <View style={styles.routeRow}>
                <View style={styles.routePoint}>
                  <View style={styles.routeDotStart} />
                  <Text style={styles.routeTextOrigin}>{selectedRoute.origin}</Text>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routePoint}>
                  <View style={styles.routeDotEnd} />
                  <Text style={styles.routeTextDestination}>{selectedRoute.destination}</Text>
                </View>
              </View>

              <View style={styles.tripInfo}>
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={18} color={COLORS.textSecondary} />
                  <Text style={styles.infoText}>{departureTime}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="cash-outline" size={18} color={COLORS.textSecondary} />
                  <Text style={styles.infoText}>
                    ${selectedRoute.price_per_seat.toLocaleString('es-CO')} / asiento
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="calendar-outline" size={18} color={COLORS.textSecondary} />
                  <Text style={styles.infoText}>{formattedDate}</Text>
                </View>
              </View>
            </View>

            {/* Driver Card */}
            <View style={styles.driverCard}>
              <View style={styles.driverHeader}>
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverInitial}>{driverInitial}</Text>
                </View>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{selectedRoute.driver_name || 'Conductor'}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color={COLORS.accent} />
                    <Text style={styles.ratingText}>{selectedRoute.driver_rating || '0'}</Text>
                    <Text style={styles.ratingLabel}> ({selectedRoute.driver_trips || 0} viajes)</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Summary */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Asientos disponibles</Text>
                <Text style={styles.summaryValue}>{availableSeatsCount} de {totalSeats}</Text>
              </View>
              {selectedSeats.length > 0 && (
                <>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>
                      Asientos ({selectedSeats.length} × ${selectedRoute.price_per_seat.toLocaleString('es-CO')})
                    </Text>
                    <Text style={styles.summaryValue}>
                      ${(selectedSeats.length * selectedRoute.price_per_seat).toLocaleString('es-CO')}
                    </Text>
                  </View>
                </>
              )}
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueBtn,
                selectedSeats.length === 0 && styles.continueBtnDisabled,
              ]}
              disabled={selectedSeats.length === 0}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Ionicons
                name={selectedSeats.length === 0 ? 'chair-outline' : 'arrow-forward'}
                size={20}
                color={selectedSeats.length === 0 ? COLORS.textSecondary : COLORS.textInverse}
              />
              <Text style={[styles.continueBtnText, selectedSeats.length === 0 && styles.continueBtnTextDisabled]}>
                {selectedSeats.length === 0
                  ? 'Selecciona tus asientos'
                  : `Continuar - $${(selectedSeats.length * selectedRoute.price_per_seat).toLocaleString('es-CO')}`}
              </Text>
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

  // Header
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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },

  // Vehicle Card
  vehicleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
    borderTopColor: COLORS.shadowWhiteLight,
    borderTopWidth: 1.5,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  vehicleName: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
  },
  vehicleDetails: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  plateBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
  },
  plateText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textInverse,
    fontWeight: '700',
  },

  // Seats
  seatsSection: {
    alignItems: 'center',
  },
  driverSeatRow: {
    marginBottom: SPACING.lg,
  },
  driverSeat: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  driverLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.textTertiary,
  },
  seatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    maxWidth: 220,
    marginBottom: SPACING.lg,
  },
  seat: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
    borderTopColor: COLORS.shadowWhiteMid,
    borderTopWidth: 1.5,
  },
  seatOccupied: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  seatSelected: {
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  seatText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textInverse,
    fontWeight: '700',
  },
  seatTextOccupied: {
    color: COLORS.textTertiary,
  },
  seatTextSelected: {
    color: COLORS.textInverse,
  },
  occupiedOverlay: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  legendText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
  },

  // Selection Card
  selectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.textTertiary,
  },
  selectionCardActive: {
    borderLeftColor: COLORS.success,
  },
  selectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  selectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionIconActive: {
    backgroundColor: COLORS.success,
  },
  selectionTitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  selectionTitleActive: {
    color: COLORS.textPrimary,
  },
  selectionSubtitle: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Trip Card
  tripCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  routePoint: {
    alignItems: 'center',
  },
  routeDotStart: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  routeDotEnd: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    marginBottom: SPACING.xs,
  },
  routeLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: SPACING.sm,
  },
  routeTextOrigin: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  routeTextDestination: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  tripInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  infoText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
  },

  // Driver Card
  driverCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverInitial: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textInverse,
    fontWeight: '700',
  },
  driverInfo: {
    flex: 1,
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

  // Summary
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.md,
  },
  summaryLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },

  // Continue Button
  continueBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
    ...SHADOWS.orangeSoft,
    borderTopColor: COLORS.shadowWhiteMid,
    borderTopWidth: 2,
    borderLeftColor: COLORS.shadowWhiteDark,
    borderLeftWidth: 1,
  },
  continueBtnDisabled: {
    backgroundColor: COLORS.surfaceAlt,
    shadowOpacity: 0,
    elevation: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  continueBtnText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textInverse,
    fontWeight: '700',
  },
  continueBtnTextDisabled: {
    color: COLORS.textSecondary,
  },
})
