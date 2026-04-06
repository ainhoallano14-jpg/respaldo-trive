import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../theme/theme'
import { useRoutes, Route } from '../hooks/useRoutes'
import { useAppStore } from '../store/useAppStore'

export default function SearchScreen() {
  const navigation = useNavigation()
  const { routes, loading, error, fetchRoutes } = useRoutes()
  const { setSelectedRoute } = useAppStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'available'>('all')
  const [displayRoutes, setDisplayRoutes] = useState<Route[]>([])

  // Cargar rutas al montar el componente
  useEffect(() => {
    loadRoutes()
  }, [])

  // Actualizar rutas filtradas cuando cambian los datos
  useEffect(() => {
    filterAndDisplayRoutes()
  }, [routes, search, filter])

  const loadRoutes = async () => {
    try {
      await fetchRoutes()
    } catch (err) {
      Alert.alert('Error', 'No se pudieron cargar las rutas')
    }
  }

  const filterAndDisplayRoutes = () => {
    let filtered = routes.filter((route) => {
      const matchSearch =
        route.origin.toLowerCase().includes(search.toLowerCase()) ||
        route.destination.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === 'all' || route.available_seats > 0
      return matchSearch && matchFilter
    })
    setDisplayRoutes(filtered)
  }

  const handleSelectRoute = (route: Route) => {
    // Guardar la ruta seleccionada en el store
    setSelectedRoute(route)
    // Navegar a SeatSelection
    navigation.navigate('SeatSelection' as never)
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CO')}`
  }

  const formatTime = (departureTime: string, arrivalTime: string) => {
    const start = new Date(departureTime)
    const end = new Date(arrivalTime)
    const diff = (end.getTime() - start.getTime()) / (1000 * 60) // minutos
    
    if (diff < 60) {
      return `~${Math.round(diff)} min`
    } else {
      const hours = Math.floor(diff / 60)
      const mins = diff % 60
      return `~${hours}h ${mins}min`
    }
  }

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Rutas disponibles</Text>
            <Text style={styles.subtitle}>{displayRoutes.length} rutas encontradas</Text>
          </View>
        </View>

        {/* Search Box */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color={COLORS.primary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar ruta..."
              placeholderTextColor={COLORS.textTertiary}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
              onPress={() => setFilter('all')}
            >
              <Ionicons
                name="list"
                size={16}
                color={filter === 'all' ? COLORS.textInverse : COLORS.textSecondary}
              />
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                Todas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'available' && styles.filterTabActive]}
              onPress={() => setFilter('available')}
            >
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={filter === 'available' ? COLORS.textInverse : COLORS.textSecondary}
              />
              <Text style={[styles.filterText, filter === 'available' && styles.filterTextActive]}>
                Con puestos
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Buscando rutas...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <View style={styles.errorIcon}>
              <Ionicons name="alert-circle-outline" size={40} color={COLORS.error} />
            </View>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={loadRoutes}>
              <Ionicons name="refresh" size={18} color={COLORS.textInverse} />
              <Text style={styles.retryBtnText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : displayRoutes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="search-outline" size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>No hay rutas</Text>
            <Text style={styles.emptyText}>
              {search || filter === 'available'
                ? 'Intenta con otros criterios de búsqueda'
                : 'No hay rutas disponibles en este momento'}
            </Text>
          </View>
        ) : (
          <View style={styles.routesContainer}>
            {displayRoutes.map((route) => (
              <TouchableOpacity
                key={route.id}
                style={styles.routeCard}
                onPress={() => handleSelectRoute(route)}
                activeOpacity={0.8}
              >
                {/* Route Header */}
                <View style={styles.routeCardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.routePoints}>
                      <Text style={styles.routeFrom}>{route.origin}</Text>
                      <View style={styles.arrowContainer}>
                        <Ionicons name="arrow-forward" size={14} color={COLORS.textTertiary} />
                      </View>
                      <Text style={styles.routeTo}>{route.destination}</Text>
                    </View>
                  </View>
                  <Text style={styles.routePrice}>{formatPrice(route.price_per_seat)}</Text>
                </View>

                {/* Route Details */}
                <View style={styles.routeDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.detailText}>
                      {formatTime(route.departure_time, route.arrival_time)}
                    </Text>
                  </View>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.detailText}>
                      {new Date(route.departure_time).toLocaleDateString('es-CO', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Text>
                  </View>
                  <View style={styles.detailDivider} />
                  <View
                    style={[
                      styles.seatsBadge,
                      route.available_seats === 0
                        ? styles.seatsFull
                        : route.available_seats <= 2
                        ? styles.seatsLow
                        : styles.seatsOk,
                    ]}
                  >
                    <Text
                      style={[
                        styles.seatsText,
                        route.available_seats === 0
                          ? styles.seatsTextFull
                          : route.available_seats <= 2
                          ? styles.seatsTextLow
                          : styles.seatsTextOk,
                      ]}
                    >
                      {route.available_seats === 0
                        ? 'Lleno'
                        : `${route.available_seats} ${route.available_seats === 1 ? 'puesto' : 'puestos'}`}
                    </Text>
                  </View>
                </View>

                {/* CTA */}
                <View style={styles.routeFooter}>
                  <Text style={styles.ctaText}>Ver detalles</Text>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
                </View>
              </TouchableOpacity>
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
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  // Search Container
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface + 'F5', // 96.1% opacidad
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    height: 48,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight + 'B3', // Semi-transparente
    ...SHADOWS.md, // Sombra reforzada
    // Efecto de luz blanca desde arriba
    borderTopColor: COLORS.shadowWhiteMid,
    borderTopWidth: 1.5,
    borderLeftColor: COLORS.shadowWhiteDark,
    borderLeftWidth: 1,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },

  // Filter Tabs
  filterTabs: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface + 'F8', // 97.3% opacidad
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight + '99', // Semi-transparente
    // Luz blanca en el borde superior
    borderTopColor: COLORS.shadowWhiteLight,
    borderTopWidth: 1.5,
    ...SHADOWS.sm,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.orangeSoft,
    borderTopColor: COLORS.shadowWhiteMid,
    borderTopWidth: 2,
  },
  filterText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.textInverse,
    fontWeight: '600',
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.lg,
  },

  // Error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxxl,
  },
  errorIcon: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.error + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.orangeSoft,
    // Sombra adicional para profundidad
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    // Bordes blancos para realismo
    borderTopWidth: 2,
    borderTopColor: COLORS.shadowWhiteMid,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.shadowWhiteDark,
  },
  retryBtnText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textInverse,
    fontWeight: '600',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxxl,
  },
  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // Routes Container
  routesContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },

  // Route Card
  routeCard: {
    backgroundColor: COLORS.surface + 'F5', // 96.1% opacidad
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight + 'B3', // Semi-transparente
    ...SHADOWS.lg, // Sombra profunda
    // Efecto de profundidad con luz blanca
    borderTopColor: COLORS.shadowWhiteMid,
    borderTopWidth: 1.5,
    borderLeftColor: COLORS.shadowWhiteDark,
    borderLeftWidth: 1,
  },
  routeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  routePoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  routeFrom: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  arrowContainer: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeTo: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primary,
    fontWeight: '600',
  },
  routePrice: {
    ...TYPOGRAPHY.h4,
    color: COLORS.accent,
    fontWeight: '700',
  },

  // Route Details
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    marginBottom: SPACING.lg,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  detailText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
  },
  detailDivider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.borderLight,
  },

  // Seats Badge
  seatsBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
  },
  seatsOk: {
    backgroundColor: COLORS.success + '15',
  },
  seatsLow: {
    backgroundColor: COLORS.warning + '15',
  },
  seatsFull: {
    backgroundColor: COLORS.borderLight,
  },
  seatsText: {
    ...TYPOGRAPHY.label,
    fontWeight: '600',
  },
  seatsTextOk: {
    color: COLORS.success,
  },
  seatsTextLow: {
    color: COLORS.warning,
  },
  seatsTextFull: {
    color: COLORS.textSecondary,
  },

  // Route Footer
  routeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  ctaText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.primary,
    fontWeight: '600',
  },
})
