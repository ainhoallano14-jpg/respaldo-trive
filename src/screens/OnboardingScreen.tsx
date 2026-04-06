import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../theme/theme'

const { width, height } = Dimensions.get('window')

interface OnboardingSlide {
  id: string
  title: string
  description: string
  icon: keyof typeof Ionicons.glyphMap
  bgColor: string
  iconColor: string
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Viaja con Trive',
    description: 'Encuentra rutas cercanas a ti de forma rápida y segura. Conduce con conductores verificados.',
    icon: 'car-sport',
    bgColor: '#E8F0FE',
    iconColor: COLORS.primary,
  },
  {
    id: '2',
    title: 'Reserva tu asiento',
    description: 'Selecciona el número de asientos que necesitas y viaja cómodo con otros pasajeros.',
    icon: 'people',
    bgColor: '#E3F2FD',
    iconColor: COLORS.accent,
  },
  {
    id: '3',
    title: 'Pago seguro',
    description: 'Paga de forma segura desde la app. Sin efectivo, sin complicaciones.',
    icon: 'card',
    bgColor: '#E8F5E9',
    iconColor: '#10B981',
  },
  {
    id: '4',
    title: 'Califica tu viaje',
    description: 'Ayúdanos a mejorar calificando a los conductores y manteniendo la calidad del servicio.',
    icon: 'star',
    bgColor: '#FFF3E0',
    iconColor: '#F59E0B',
  },
]

interface OnboardingScreenProps {
  onComplete: () => void
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollX = useRef(new Animated.Value(0)).current
  const scrollViewRef = useRef<ScrollView>(null)

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width)
        setCurrentIndex(index)
      },
    }
  )

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      })
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    })
  }

  const renderSlide = (slide: OnboardingSlide, index: number) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

    // Animaciones para el contenedor del ícono
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: 'clamp',
    })

    const rotate = scrollX.interpolate({
      inputRange,
      outputRange: ['-15deg', '0deg', '15deg'],
      extrapolate: 'clamp',
    })

    // Animaciones para el texto
    const textOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    })

    const textTranslateY = scrollX.interpolate({
      inputRange,
      outputRange: [50, 0, -50],
      extrapolate: 'clamp',
    })

    return (
      <View key={slide.id} style={styles.slide}>
        {/* Círculo decorativo de fondo */}
        <View style={[styles.decorCircle, { backgroundColor: slide.bgColor }]} />

        {/* Ícono principal con animación */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              backgroundColor: slide.bgColor,
              transform: [{ scale }, { rotate }],
            },
          ]}
        >
          <Ionicons name={slide.icon} size={100} color={slide.iconColor} />
        </Animated.View>

        {/* Círculos decorativos pequeños */}
        <View style={[styles.decorSmall1, { backgroundColor: slide.bgColor }]} />
        <View style={[styles.decorSmall2, { backgroundColor: slide.bgColor }]} />

        {/* Textos con animación */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={[styles.slideTitle, { color: COLORS.textPrimary }]}>
            {slide.title}
          </Text>
          <Text style={styles.slideDescription}>{slide.description}</Text>
        </Animated.View>
      </View>
    )
  }

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {slides.map((slide, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [12, 32, 12],
            extrapolate: 'clamp',
          })

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          })

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => goToSlide(index)}
            >
              <Animated.View
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor:
                      index === currentIndex ? COLORS.primary : COLORS.borderLight,
                  },
                ]}
              />
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  const isLastSlide = currentIndex === slides.length - 1

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Fondo con círculos decorativos 3D */}
      <View style={styles.bgContainer}>
        <LinearGradient
          colors={[COLORS.primaryLight + '32', COLORS.primary + '16', COLORS.primaryDark + '06']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientCircle, styles.gradientCircle1]}
        />
        <LinearGradient
          colors={[COLORS.primaryLight + '25', COLORS.primary + '12', COLORS.primaryDark + '04']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientCircle, styles.gradientCircle2]}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        {/* Espaciador para centrar */}
        <View style={{ width: 60 }} />

        {/* Título superior */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Trive</Text>
        </View>

        {/* Botón saltar */}
        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>
            {isLastSlide ? '' : 'Omitir'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width}
        style={styles.scrollView}
      >
        {slides.map(renderSlide)}
      </ScrollView>

      {/* Footer con paginación y botón */}
      <View style={styles.footer}>
        {/* Números de página */}
        <View style={styles.pageIndicator}>
          {slides.map((_, index) => (
            <Text
              key={index}
              style={[
                styles.pageNumber,
                index === currentIndex && styles.pageNumberActive,
              ]}
            >
              {String(index + 1).padStart(2, '0')}
            </Text>
          ))}
        </View>

        {renderPagination()}

        {/* Botón siguiente / comenzar */}
        <TouchableOpacity
          style={[
            styles.nextBtn,
            isLastSlide && styles.getStartedBtn,
          ]}
          onPress={handleNext}
          activeOpacity={0.9}
        >
          <Text
            style={[
              styles.nextBtnText,
              isLastSlide && styles.getStartedBtnText,
            ]}
          >
            {isLastSlide ? 'Comenzar' : 'Siguiente'}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={isLastSlide ? '#fff' : COLORS.primary}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Fondo con círculos decorativos 3D
  bgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientCircle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  gradientCircle1: {
    top: -120,
    right: -100,
    width: 320,
    height: 320,
  },
  gradientCircle2: {
    bottom: -100,
    left: -100,
    width: 300,
    height: 300,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
    fontWeight: '700',
  },
  skipBtn: {
    width: 60,
    alignItems: 'flex-end',
  },
  skipText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  decorCircle: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    top: '10%',
    opacity: 0.5,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  decorSmall1: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    top: '25%',
    right: '15%',
    opacity: 0.4,
  },
  decorSmall2: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    bottom: '35%',
    left: '12%',
    opacity: 0.3,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xxxl,
  },
  slideTitle: {
    ...TYPOGRAPHY.h2,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.md,
    letterSpacing: -0.5,
  },
  slideDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: SPACING.lg,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl + 20,
    paddingTop: SPACING.lg,
    alignItems: 'center',
  },
  pageIndicator: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  pageNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textTertiary,
    marginHorizontal: SPACING.xs,
  },
  pageNumberActive: {
    color: COLORS.primary,
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.xxxl,
    gap: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.primary,
    width: '100%',
    ...SHADOWS.sm,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  getStartedBtn: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  getStartedBtnText: {
    color: '#fff',
  },
})
