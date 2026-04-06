import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../theme/theme'
import { useRoutes } from '../hooks/useRoutes'
import { useAppStore } from '../store/useAppStore'

export default function DriverRegisterScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const { user } = useAppStore()
  const { createRoute, loading: routeLoading, error: routeError } = useRoutes()

  // Ruta campos
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departureTime, setDepartureTime] = useState('')
  const [arrivalTime, setArrivalTime] = useState('')
  const [totalSeats, setTotalSeats] = useState('')
  const [pricePerSeat, setPricePerSeat] = useState('')

  // Vehículo campos
  const [vehicleMake, setVehicleMake] = useState('')
  const [vehicleYear, setVehicleYear] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')

  const validateForm = () => {
    if (!origin.trim()) {
      Alert.alert('Error', 'Por favor ingresa el origen')
      return false
    }
    if (!destination.trim()) {
      Alert.alert('Error', 'Por favor ingresa el destino')
      return false
    }
    if (!departureTime.trim()) {
      Alert.alert('Error', 'Por favor ingresa la hora de salida (ej: 08:30)')
      return false
    }
    if (!arrivalTime.trim()) {
      Alert.alert('Error', 'Por favor ingresa la hora de llegada (ej: 10:30)')
      return false
    }
    if (!totalSeats.trim() || parseInt(totalSeats) < 1 || parseInt(totalSeats) > 8) {
      Alert.alert('Error', 'Por favor ingresa asientos válidos (1-8)')
      return false
    }
    if (!pricePerSeat.trim() || parseFloat(pricePerSeat) <= 0) {
      Alert.alert('Error', 'Por favor ingresa un precio válido')
      return false
    }
    if (!vehicleMake.trim()) {
      Alert.alert('Error', 'Por favor ingresa la marca del vehículo')
      return false
    }
    if (!vehicleYear.trim() || vehicleYear.length !== 4) {
      Alert.alert('Error', 'Por favor ingresa un año válido (ej: 2020)')
      return false
    }
    if (!vehiclePlate.trim()) {
      Alert.alert('Error', 'Por favor ingresa la placa del vehículo')
      return false
    }
    if (!vehicleColor.trim()) {
      Alert.alert('Error', 'Por favor ingresa el color del vehículo')
      return false
    }
    return true
  }

  const handleCreateRoute = async () => {
    if (!validateForm()) return
    if (!user?.id) {
      Alert.alert('Error', 'Usuario no autenticado')
      return
    }

    try {
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]

      const routeData = {
        driver_id: user.id,
        origin: origin.trim(),
        destination: destination.trim(),
        departure_time: `${dateStr}T${departureTime}:00`,
        arrival_time: `${dateStr}T${arrivalTime}:00`,
        price_per_seat: parseFloat(pricePerSeat),
        total_seats: parseInt(totalSeats),
        available_seats: parseInt(totalSeats),
        vehicle_make: vehicleMake.trim(),
        vehicle_model: '',
        vehicle_year: parseInt(vehicleYear),
        vehicle_plate: vehiclePlate.trim().toUpperCase(),
        vehicle_color: vehicleColor.trim(),
        status: 'scheduled',
      }

      const newRoute = await createRoute(routeData as any)

      Alert.alert(
        'Éxito',
        '¡Ruta creada correctamente! Los pasajeros ya pueden verla y reservar.',
        [
          {
            text: 'Ir al inicio',
            onPress: () => {
              navigation.navigate('Main' as never)
            },
          },
        ]
      )

      // Limpiar formulario
      setOrigin('')
      setDestination('')
      setDepartureTime('')
      setArrivalTime('')
      setTotalSeats('')
      setPricePerSeat('')
      setVehicleMake('')
      setVehicleYear('')
      setVehiclePlate('')
      setVehicleColor('')
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Error al crear la ruta. Intenta de nuevo.')
    }
  }

  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Crea tu ruta</Text>
            <Text style={styles.subtitle}>Publica tu viaje y gana dinero</Text>
          </View>
        </View>

        {/* Intro Card */}
        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Ionicons name="car" size={32} color={COLORS.textInverse} />
          </View>
          <Text style={styles.introTitle}>Eres un nuevo conductor</Text>
          <Text style={styles.introText}>
            Completa todos los datos para que los pasajeros confíen en ti
          </Text>
        </View>

        {/* RUTA DETAILS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons name="map" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Detalles de la ruta</Text>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <TextInput
              style={styles.input}
              placeholder="Origen (ciudad/sector)"
              placeholderTextColor={COLORS.textTertiary}
              value={origin}
              onChangeText={setOrigin}
              editable={!routeLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="navigate-circle" size={20} color={COLORS.primary} />
            <TextInput
              style={styles.input}
              placeholder="Destino (ciudad/sector)"
              placeholderTextColor={COLORS.textTertiary}
              value={destination}
              onChangeText={setDestination}
              editable={!routeLoading}
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Ionicons name="time" size={20} color={COLORS.accent} />
              <TextInput
                style={styles.input}
                placeholder="Salida (HH:MM)"
                placeholderTextColor={COLORS.textTertiary}
                value={departureTime}
                onChangeText={setDepartureTime}
                maxLength={5}
                editable={!routeLoading}
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1, marginLeft: SPACING.md }]}>
              <Ionicons name="time" size={20} color={COLORS.accent} />
              <TextInput
                style={styles.input}
                placeholder="Llegada (HH:MM)"
                placeholderTextColor={COLORS.textTertiary}
                value={arrivalTime}
                onChangeText={setArrivalTime}
                maxLength={5}
                editable={!routeLoading}
              />
            </View>
          </View>
        </View>

        {/* SEATS & PRICE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons name="ticket" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Asientos y tarifa</Text>
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Ionicons name="people" size={20} color={COLORS.accent} />
              <TextInput
                style={styles.input}
                placeholder="Total asientos"
                placeholderTextColor={COLORS.textTertiary}
                value={totalSeats}
                onChangeText={setTotalSeats}
                keyboardType="numeric"
                maxLength={1}
                editable={!routeLoading}
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1, marginLeft: SPACING.md }]}>
              <Ionicons name="cash" size={20} color={COLORS.accent} />
              <TextInput
                style={styles.input}
                placeholder="Precio por asiento"
                placeholderTextColor={COLORS.textTertiary}
                value={pricePerSeat}
                onChangeText={setPricePerSeat}
                keyboardType="decimal-pad"
                editable={!routeLoading}
              />
            </View>
          </View>

          {totalSeats && pricePerSeat && (
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryLeft}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                  <Text style={styles.summaryLabel}>Asientos disponibles</Text>
                </View>
                <Text style={styles.summaryValue}>{totalSeats}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <View style={styles.summaryLeft}>
                  <Ionicons name="trending-up" size={20} color={COLORS.accent} />
                  <Text style={styles.summaryLabel}>Ingreso estimado</Text>
                </View>
                <Text style={[styles.summaryValue, { color: COLORS.accent }]}>
                  ${(parseInt(totalSeats) * parseFloat(pricePerSeat)).toLocaleString('es-CO')}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* VEHICLE INFO */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons name="car" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Datos del vehículo</Text>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="car-sport" size={20} color={COLORS.accent} />
            <TextInput
              style={styles.input}
              placeholder="Marca (ej: Toyota, Chevrolet)"
              placeholderTextColor={COLORS.textTertiary}
              value={vehicleMake}
              onChangeText={setVehicleMake}
              editable={!routeLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="calendar" size={20} color={COLORS.accent} />
            <TextInput
              style={styles.input}
              placeholder="Año (ej: 2020)"
              placeholderTextColor={COLORS.textTertiary}
              value={vehicleYear}
              onChangeText={setVehicleYear}
              keyboardType="numeric"
              maxLength={4}
              editable={!routeLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="layers" size={20} color={COLORS.accent} />
            <TextInput
              style={styles.input}
              placeholder="Placa (ej: PTX-234)"
              placeholderTextColor={COLORS.textTertiary}
              value={vehiclePlate}
              onChangeText={setVehiclePlate}
              autoCapitalize="characters"
              editable={!routeLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="color-palette" size={20} color={COLORS.accent} />
            <TextInput
              style={styles.input}
              placeholder="Color (ej: Blanco, Negro)"
              placeholderTextColor={COLORS.textTertiary}
              value={vehicleColor}
              onChangeText={setVehicleColor}
              editable={!routeLoading}
            />
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <View style={styles.infoIconBox}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Información importante</Text>
            <Text style={styles.infoText}>
              Tu ruta será visible inmediatamente. Asegúrate de que todos los datos sean correctos.
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.submitBtn, routeLoading && styles.submitBtnDisabled]}
          onPress={handleCreateRoute}
          disabled={routeLoading}
          activeOpacity={0.8}
        >
          {routeLoading ? (
            <ActivityIndicator size="small" color={COLORS.textInverse} />
          ) : (
            <>
              <Ionicons name="checkmark-done" size={20} color={COLORS.textInverse} />
              <Text style={styles.submitBtnText}>Publicar Ruta</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          disabled={routeLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelBtnText}>Cancelar</Text>
        </TouchableOpacity>
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
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.lg,
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
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  // Intro Card
  introCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  introIcon: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  introTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textInverse,
    marginBottom: SPACING.xs,
  },
  introText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textInverse + '80',
    textAlign: 'center',
  },

  // Section
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
  },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface + 'F8', // 97.3% opacidad
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    height: 52,
    marginBottom: SPACING.md,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight + '99', // Semi-transparente
    ...SHADOWS.md, // Sombra reforzada
    // Luz blanca sutil desde arriba
    borderTopColor: COLORS.shadowWhiteLight,
    borderTopWidth: 1.5,
    borderLeftColor: COLORS.shadowWhiteDark,
    borderLeftWidth: 1,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    padding: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
  },

  // Summary Box - estilo premium con dorado
  summaryBox: {
    backgroundColor: COLORS.accentLight + '40', // Dorado con mayor transparencia (25%)
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '40', // Borde semi-transparente
    ...SHADOWS.md, // Sombra reforzada
    // Borde superior con color dorado
    borderTopColor: COLORS.accent,
    borderTopWidth: 2.5,
    borderLeftColor: COLORS.shadowWhiteDark,
    borderLeftWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
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
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
  },

  // Info Box
  infoBox: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  infoText: {
    ...TYPOGRAPHY.labelMedium,
    color: COLORS.textSecondary,
  },

  // Buttons
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.orangeSoft,
    // Sombra profunda adicional
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 10,
    // Bordes blancos para efecto 3D
    borderTopWidth: 2.5,
    borderTopColor: COLORS.shadowWhiteMid,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.shadowWhiteDark,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: COLORS.textInverse,
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
  },
  cancelBtn: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  cancelBtnText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
})
