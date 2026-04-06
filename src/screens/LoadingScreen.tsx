import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../theme/colors'

export default function LoadingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
})
