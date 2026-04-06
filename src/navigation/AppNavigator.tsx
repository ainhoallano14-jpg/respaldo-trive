import { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from './TabNavigator'
import LoginPhoneScreen from '../screens/LoginPhoneScreen'
import RegisterScreen from '../screens/RegisterScreen'
import SeatSelectionScreen from '../screens/SeatSelectionScreen'
import BookingScreen from '../screens/BookingScreen'
import TripStatusScreen from '../screens/TripStatusScreen'
import DriverRegisterScreen from '../screens/DriverRegisterScreen'
import DriverPanelScreen from '../screens/DriverPanelScreen'
import NotificationsScreen from '../screens/NotificationsScreen'
import SettingsScreen from '../screens/SettingsScreen'
import SecurityScreen from '../screens/SecurityScreen'
import SessionHistoryScreen from '../screens/SessionHistoryScreen'
import RecoveryAccountScreen from '../screens/RecoveryAccountScreen'
import RecentActivityScreen from '../screens/RecentActivityScreen'
import PrivacyScreen from '../screens/PrivacyScreen'
import LoadingScreen from '../screens/LoadingScreen'
import OnboardingScreen from '../screens/OnboardingScreen'
import ScheduledTripsScreen from '../screens/ScheduledTripsScreen'
import GroupTripsScreen from '../screens/GroupTripsScreen'
import FavoriteRoutesScreen from '../screens/FavoriteRoutesScreen'
import TripHistoryScreen from '../screens/TripHistoryScreen'
import { useAppStore } from '../store/useAppStore'
import { useAuth } from '../hooks/useAuth'

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
  const { isAuthenticated } = useAppStore()
  const { session, loading: authLoading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const hasSeenOnboarding = useAppStore((state) => state.hasSeenOnboarding)
  const setHasSeenOnboarding = useAppStore((state) => state.setHasSeenOnboarding)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted || authLoading) {
    return <LoadingScreen />
  }

  // Mostrar onboarding si no lo ha visto
  if (!hasSeenOnboarding) {
    return (
      <OnboardingScreen
        onComplete={() => setHasSeenOnboarding(true)}
      />
    )
  }

  // Usar session como fuente de verdad, ya que está conectado a Supabase Auth.onAuthStateChange
  const isUserAuthenticated = !!session

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isUserAuthenticated && (
          <>
            <Stack.Screen name="Login" component={LoginPhoneScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}

        {isUserAuthenticated && <Stack.Screen name="Main" component={TabNavigator} />}

        {isUserAuthenticated && (
          <>
            <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="TripStatus" component={TripStatusScreen} />
            <Stack.Screen name="DriverRegister" component={DriverRegisterScreen} />
            <Stack.Screen name="DriverPanel" component={DriverPanelScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Privacy" component={PrivacyScreen} />
            <Stack.Screen name="Security" component={SecurityScreen} />
            <Stack.Screen name="SessionHistory" component={SessionHistoryScreen} />
            <Stack.Screen name="RecoveryAccount" component={RecoveryAccountScreen} />
            <Stack.Screen name="RecentActivity" component={RecentActivityScreen} />
            <Stack.Screen name="ScheduledTrips" component={ScheduledTripsScreen} />
            <Stack.Screen name="GroupTrips" component={GroupTripsScreen} />
            <Stack.Screen name="FavoriteRoutes" component={FavoriteRoutesScreen} />
            <Stack.Screen name="TripHistory" component={TripHistoryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
