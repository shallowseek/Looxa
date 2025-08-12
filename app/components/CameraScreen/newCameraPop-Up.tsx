"use client"

import { View, StyleSheet, Dimensions, Pressable } from "react-native"
import { IconButton, Text } from "react-native-paper"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { useEffect } from "react"

const { width } = Dimensions.get("window")
const scale = (size: number) => (width / 375) * size

interface CameraPermissionPopupProps {
  visible: boolean
  onClose: () => void
}

export function CameraPermissionPopup({ visible, onClose }: CameraPermissionPopupProps) {
  // Animation values
  const popupScale = useSharedValue(0)
  const popupOpacity = useSharedValue(0)
  const glowAnimation = useSharedValue(0)
  const shimmerAnimation = useSharedValue(0)

  useEffect(() => {
    if (visible) {
      popupScale.value = withSpring(1, { damping: 15, stiffness: 150 })
      popupOpacity.value = withTiming(1, { duration: 300 })
    } else {
      popupScale.value = withSpring(0, { damping: 15, stiffness: 150 })
      popupOpacity.value = withTiming(0, { duration: 300 })
    }

    // Continuous animations
    glowAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sine) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sine) }),
      ),
      -1,
      true,
    )

    shimmerAnimation.value = withRepeat(
      withSequence(withTiming(1, { duration: 3000, easing: Easing.linear }), withTiming(0, { duration: 0 })),
      -1,
      false,
    )
  }, [visible])

  const popupStyle = useAnimatedStyle(() => ({
    transform: [{ scale: popupScale.value }],
    opacity: popupOpacity.value,
  }))

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowAnimation.value, [0, 1], [0.8, 1], "clamp"),
  }))

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmerAnimation.value, [0, 1], [-width * 0.8, width * 0.8], "clamp")
    const opacity = interpolate(shimmerAnimation.value, [0, 0.5, 1], [0, 0.6, 0], "clamp")
    return {
      transform: [{ translateX }],
      opacity,
    }
  })

  if (!visible) return null

  return (
    <View style={styles.overlay}>
      <BlurView intensity={25} tint="dark" style={styles.blurContainer}>
        <Animated.View style={[styles.popupContainer, popupStyle]}>
          <Animated.View style={[styles.popupWrapper, glowStyle]}>
            {/* Animated border */}
            <View style={styles.borderShader}>
              <LinearGradient
                colors={["#00ff41", "#0080ff", "#ff00ff", "#00ff41"]}
                style={styles.borderGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </View>

            <View style={styles.popup}>
              <LinearGradient
                colors={["rgba(26,26,26,0.95)", "rgba(42,42,42,0.9)"]}
                style={styles.popupGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Shimmer effect */}
                <Animated.View style={[styles.shimmer, shimmerStyle]}>
                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(0,255,65,0.3)",
                      "rgba(0,255,65,0.6)",
                      "rgba(0,255,65,0.3)",
                      "transparent",
                    ]}
                    style={styles.shimmerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </Animated.View>

                {/* Camera Icon */}
                <View style={styles.iconContainer}>
                  <View style={styles.iconWrapper}>
                    <LinearGradient
                      colors={["#00ff41", "#008f11"]}
                      style={styles.iconGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <IconButton icon="camera" size={40} iconColor="#000" style={styles.icon} />
                    </LinearGradient>
                  </View>
                </View>

                {/* Title */}
                <Text style={styles.title}>Allow Camera Access</Text>

                {/* Message */}
                <Text style={styles.message}>
                  To detect colors in real-time, Colory needs access to your camera. This lets the app identify and
                  display colors directly from your surroundings.
                </Text>

                {/* Button */}
                <Pressable style={styles.button} onPress={onClose}>
                  <LinearGradient
                    colors={["#667eea", "#764ba2", "#f093fb"]}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.buttonText}>I Understand</Text>
                    <IconButton icon="check" size={20} iconColor="#fff" style={styles.buttonIcon} />
                  </LinearGradient>
                </Pressable>
              </LinearGradient>
            </View>
          </Animated.View>
        </Animated.View>
      </BlurView>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(20),
  },
  popupContainer: {
    width: "100%",
    maxWidth: scale(350),
  },
  popupWrapper: {
    position: "relative",
  },
  borderShader: {
    position: "absolute",
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: scale(23),
    zIndex: 1,
  },
  borderGradient: {
    flex: 1,
    borderRadius: scale(23),
  },
  popup: {
    borderRadius: scale(20),
    overflow: "hidden",
    zIndex: 2,
    elevation: 20,
    shadowColor: "#00ff41",
    shadowOffset: { width: 0, height: scale(10) },
    shadowOpacity: 0.5,
    shadowRadius: scale(20),
  },
  popupGradient: {
    padding: scale(30),
    position: "relative",
    alignItems: "center",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: -scale(100),
    bottom: 0,
    width: scale(60),
    zIndex: 3,
  },
  shimmerGradient: {
    flex: 1,
    width: "100%",
  },
  iconContainer: {
    marginBottom: scale(20),
    zIndex: 4,
  },
  iconWrapper: {
    borderRadius: scale(35),
    overflow: "hidden",
    elevation: 12,
    shadowColor: "#00ff41",
    shadowOffset: { width: 0, height: scale(6) },
    shadowOpacity: 0.8,
    shadowRadius: scale(15),
  },
  iconGradient: {
    padding: scale(15),
  },
  icon: {
    margin: 0,
  },
  title: {
    color: "#fff",
    fontSize: scale(24),
    fontWeight: "bold",
    marginBottom: scale(15),
    textAlign: "center",
    textShadowColor: "#00ff41",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: scale(10),
    zIndex: 4,
  },
  message: {
    color: "rgba(255,255,255,0.9)",
    fontSize: scale(16),
    lineHeight: scale(24),
    textAlign: "center",
    marginBottom: scale(30),
    textShadowColor: "rgba(0,255,65,0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: scale(5),
    zIndex: 4,
  },
  button: {
    borderRadius: scale(25),
    overflow: "hidden",
    elevation: 12,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: scale(6) },
    shadowOpacity: 0.6,
    shadowRadius: scale(15),
    zIndex: 4,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(40),
    paddingVertical: scale(15),
    gap: scale(10),
  },
  buttonText: {
    color: "#fff",
    fontSize: scale(18),
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: scale(2),
  },
  buttonIcon: {
    margin: 0,
  },
})
