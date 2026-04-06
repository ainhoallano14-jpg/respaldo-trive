import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../theme/theme'

// Mock data - después se conecta a Supabase
const scheduledTrips = [
  {
    id: '1',
    origin: 'Cali',
    destination: 'Puerto Tejada',
    date: '2026-04-10',
    time: '14:30',
    seats: 2,
    price: 11000,
    status: 'upcoming',
  },
  {
    id: '2',
    origin: 'Jamundí',
    destination: 'Cali',
    date: '2026-04-12',
    time: '08:00',
    seats: 1,
    price: 4200,
    status: 'upcoming',
  },
]

export default function ScheduledTripsScreen() {
  const navigation = useNavigation()

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-CO', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  }

  const handleCancel = (tripId: string) => {
    Alert.alert(
      'Cancelar viaje',
      '¿Estás seguro de que deseas cancelar este viaje programado?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí, cancelar', style: 'destructive', onPress: () => {} },
      ]
    )
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
            <Text style={styles.title}>Viajes Programados</Text>
            <Text style={styles.subtitle}>Tus viajes para más adelante</Text>
          </View>
        </View>

        {scheduledTrips.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrapper}>
              <Ionicons name="calendar-outline" size={64} color={COLORS.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>Sin viajes programados</Text>
            <Text style={styles.emptyText}>
              Programa tus viajes con anticipación y reserva tu asiento
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
            {scheduledTrips.map((trip) => (
              <View key={trip.id} style={styles.tripCard}>
                <View style={styles.tripHeader}>
                  <View style={styles.statusBadge}>
                    <Ionicons name="time" size={12} color={COLORS.primary} />
                    <Text style={styles.statusText}>Programado</Text>
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

                <View style={styles.tripActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(trip.id)}>
                    <Text style={styles.cancelBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() => navigation.navigate('TripStatus' as never)}
                  >
                    <Text style={styles.viewBtnText}>Ver detalles</Text>
                  </TouchableOpacity>
                </View>
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
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: 100,
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
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  statusText: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
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
    marginBottom: SPACING.lg,
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
  tripActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error,
    alignItems: 'center',
  },
  cancelBtnText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.error,
    fontWeight: '600',
  },
  viewBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  viewBtnText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textInverse,
    fontWeight: '600',
  },
})
