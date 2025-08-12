"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, Dimensions, SafeAreaView, StatusBar, TextInput, Pressable } from "react-native"
import { IconButton, Card, Text, Surface, Menu } from "react-native-paper"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
  withSpring,
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ScrollView } from "dripsy"

// Using color namer package
const namer = require("color-namer")

const { width, height } = Dimensions.get("window")

const guidelineBaseWidth = 375
const scale = (size: number) => (width / guidelineBaseWidth) * size

export default function ColorConverterScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  // State management
  const [inputFormat, setInputFormat] = useState<"HEX" | "RGB">("HEX")
  const [inputValue, setInputValue] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [showAnalogicMenu, setShowAnalogicMenu] = useState(false)
  const [selectedAnalogic, setSelectedAnalogic] = useState("Analogic")
  const [apiData, setApiData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [colorName, setColorName] = useState("") // Add state for color name

  // Animation values
  const glowAnimation = useSharedValue(0)
  const shimmerAnimation = useSharedValue(0)
  const borderShaderAnimation = useSharedValue(0)
  const loaderRotation = useSharedValue(0)
  const loaderPulse = useSharedValue(0)
  const loaderGlow = useSharedValue(0)

  // Menu item animation values
  const analogicScale = useSharedValue(1)
  const complementaryScale = useSharedValue(1)
  const triadicScale = useSharedValue(1)
  const monochromaticScale = useSharedValue(1)

  // Sample color data (you can replace with actual conversion logic)
  const [colorData, setColorData] = useState({
    hsl: "hsl(210, 100%, 50%)",
    cmyk: "cmyk(100%, 50%, 0%, 0%)",
    hex: "#0080FF",
    rgb: "rgb(0, 128, 255)",
  })

  // Sample analogic colors
  const [sampleColors, setSampleColors] = useState(["#0080FF", "#0066CC", "#004C99", "#003366", "#001A33"])

  useEffect(() => {
    // Start animations - removed pulse animation to stop heartbeat effect
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

    // Fixed border shader - no rotation
    borderShaderAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sine) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.sine) }),
      ),
      -1,
      true,
    )

    // Loader animations
    loaderRotation.value = withRepeat(withTiming(360, { duration: 2000, easing: Easing.linear }), -1, false)

    loaderPulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.sine) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.sine) }),
      ),
      -1,
      true,
    )

    loaderGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sine) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.sine) }),
      ),
      -1,
      true,
    )
  }, [])

  const handleFetch = async () => {
    setIsLoading(true)
    try {
      const newSampleColors = []

      if (inputFormat === "HEX") {
        const names = namer(inputValue.toUpperCase())
        const cleanHex = inputValue?.trim().replace("#", "").toUpperCase()
        const response = await fetch(
          `https://www.thecolorapi.com/scheme?hex=${cleanHex}&format=json&count=5&mode=${selectedAnalogic.toLowerCase()}`,
        )
        const data = await response.json()
        setShowResults(true)
        setColorData({
          hex: data.seed.hex.value,
          hsl: data.seed.hsl.value,
          cmyk: data.seed.cmyk.value,
          rgb: data.seed.rgb.value,
        })

        // Set color name from color-namer
        setColorName(names.html[0].name)

        data.colors.forEach((color) => {
          console.log("this is the color sample", color.hex.value)
          newSampleColors.push(color.hex.value)
        })
      } else {
        const response = await fetch(
          `https://www.thecolorapi.com/scheme?rgb=${inputValue.trim()}&format=json&count=5&mode=${selectedAnalogic.toLowerCase()}`,
        )
        const data = await response.json()
        setShowResults(true)
        setColorData({
          hex: data.seed.hex.value,
          hsl: data.seed.hsl.value,
          cmyk: data.seed.cmyk.value,
          rgb: data.seed.rgb.value,
        })

        // Get color name for RGB input by converting to hex first
        const names = namer(data.seed.hex.value)
        setColorName(names.html[0].name)

        data.colors.forEach((color) => {
          newSampleColors.push(color.hex.value)
        })
      }

      setSampleColors(newSampleColors)
    } catch (error) {
      console.log("Failed to fetch data", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleInputFormat = () => {
    setInputFormat(inputFormat === "HEX" ? "RGB" : "HEX")
    setInputValue("") // Clear input when switching formats
  }

  // Handle input value with proper formatting
  const handleInputChange = (text: string) => {
    if (inputFormat === "HEX") {
      // Ensure HEX format starts with #
      if (text.length === 0) {
        setInputValue("")
      } else if (text.startsWith("#")) {
        setInputValue(text)
      } else {
        setInputValue("#" + text)
      }
    } else {
      setInputValue(text)
    }
  }

  // Menu item press handlers with animation
  const handleMenuItemPress = (item: string, scaleValue: Animated.SharedValue<number>) => {
    // Zoom in effect
    scaleValue.value = withSpring(1.1, { damping: 10, stiffness: 100 })

    setTimeout(() => {
      setSelectedAnalogic(item)
      setShowAnalogicMenu(false)
      // Zoom out effect
      scaleValue.value = withSpring(1, { damping: 10, stiffness: 100 })
    }, 150)
  }

  // Animation styles - removed pulse and fixed border shader
  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowAnimation.value, [0, 1], [0.9, 1], "clamp"),
  }))

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmerAnimation.value, [0, 1], [-width * 1.2, width * 1.2], "clamp")
    const opacity = interpolate(shimmerAnimation.value, [0, 0.5, 1], [0, 0.6, 0], "clamp")
    return {
      transform: [{ translateX }],
      opacity,
    }
  })

  const borderShaderStyle = useAnimatedStyle(() => {
    // Fixed: No rotation, just opacity animation
    const opacity = interpolate(borderShaderAnimation.value, [0, 1], [0.4, 0.8], "clamp")
    return {
      opacity,
    }
  })

  // Menu item animation styles
  const analogicAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: analogicScale.value }],
  }))

  const complementaryAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: complementaryScale.value }],
  }))

  const triadicAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: triadicScale.value }],
  }))

  const monochromaticAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: monochromaticScale.value }],
  }))

  // Loader animation styles
  const loaderRotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${loaderRotation.value}deg` }],
  }))

  const loaderPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: loaderPulse.value }],
  }))

  const loaderGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(loaderGlow.value, [0, 1], [0.6, 1], "clamp"),
  }))

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* Main Content */}
      <View style={[styles.mainContent, { paddingBottom: insets.bottom + scale(80) }]}>
        {/* Header */}
        <Surface style={styles.header} elevation={8}>
          <LinearGradient
            colors={["#1a1a1a", "#2a2a2a"]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Back Button */}
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor="#fff"
              onPress={() => {
                console.log("Back pressed")
                router.back()
              }}
              style={styles.backButton}
            />

            {/* Title */}
            <Text style={styles.title}>Color Converter</Text>

            {/* Theme Toggle */}
            <IconButton
              icon={isDarkTheme ? "weather-sunny" : "weather-night"}
              size={24}
              iconColor="#fff"
              onPress={() => {
                setIsDarkTheme(!isDarkTheme)
                console.log("Theme toggled:", !isDarkTheme ? "Dark" : "Light")
              }}
              style={styles.themeButton}
            />
          </LinearGradient>
        </Surface>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Animated.View style={[styles.inputContainer, glowStyle]}>
            {/* Animated border shader - Fixed */}
            <Animated.View style={[styles.inputBorderShader, borderShaderStyle]}>
              <LinearGradient
                colors={["#00ff41", "#0080ff", "#ff00ff", "#00ff41"]}
                style={styles.inputBorderGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>

            <BlurView intensity={40} tint="dark" style={styles.inputBlurContainer}>
              <LinearGradient colors={["rgba(26,26,26,0.9)", "rgba(42,42,42,0.8)"]} style={styles.inputGradient}>
                {/* Shimmer effect */}
                <Animated.View style={[styles.inputShimmer, shimmerStyle]}>
                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(0,255,65,0.3)",
                      "rgba(0,255,65,0.6)",
                      "rgba(0,255,65,0.3)",
                      "transparent",
                    ]}
                    style={styles.inputShimmerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </Animated.View>

                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.textInput}
                    value={inputValue}
                    onChangeText={handleInputChange}
                    placeholder={inputFormat === "HEX" ? "#FF0000" : "rgb(255, 0, 0)"}
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    editable={!isLoading}
                  />

                  {/* Format Toggle Button - Removed pulse animation */}
                  <Pressable style={styles.formatButton} onPress={toggleInputFormat} disabled={isLoading}>
                    <LinearGradient
                      colors={["#00ff41", "#008f11"]}
                      style={styles.formatButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.formatButtonText}>{inputFormat}</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </LinearGradient>
            </BlurView>
          </Animated.View>

          {/* Fetch Button - Removed pulse animation */}
          <View style={styles.fetchButtonContainer}>
            <Pressable style={styles.fetchButton} onPress={handleFetch} disabled={isLoading}>
              <LinearGradient
                colors={["#667eea", "#764ba2", "#f093fb"]}
                style={styles.fetchButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.fetchButtonText}>{isLoading ? "Fetching..." : "Fetch"}</Text>
                <IconButton icon="download" size={20} iconColor="#fff" style={styles.fetchIcon} />
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        {/* Results Section - Combined Color Name, Color Formats and Color Harmony */}
        {showResults && (
          <ScrollView>
          <View style={styles.resultsSection}>
            {/* Single Combined Box - Color Name + Color Formats + Color Harmony */}
            <View style={styles.resultCard}>
              <Card style={styles.combinedCard}>
                <LinearGradient
                  colors={["rgba(26,26,26,0.95)", "rgba(42,42,42,0.9)"]}
                  style={styles.combinedCardGradient}
                >
                  {/* Color Name Section */}
                  <View style={styles.colorNameSection}>
                    <Text style={styles.cardTitle}>Color Name</Text>
                    <View style={styles.colorNameContainer}>
                      <Text style={styles.colorNameValue}>{colorName}</Text>
                    </View>
                  </View>

                  {/* Color Formats Section */}
                  <Text style={styles.cardTitle}>Color Formats</Text>

                  {/* Removed ScrollView and made it a regular View to ensure all content is visible */}
                  <View style={styles.formatContainer}>
                    <View style={styles.formatRow}>
                      <Text style={styles.formatLabel}>HSL:</Text>
                      <Text style={styles.formatValue}>{colorData.hsl}</Text>
                    </View>

                    <View style={styles.formatRow}>
                      <Text style={styles.formatLabel}>CMYK:</Text>
                      <Text style={styles.formatValue}>{colorData.cmyk}</Text>
                    </View>

                    <View style={styles.formatRow}>
                      <Text style={styles.formatLabel}>{inputFormat === "HEX" ? "RGB:" : "HEX:"}</Text>
                      <Text style={styles.formatValue}>{inputFormat === "HEX" ? colorData.rgb : colorData.hex}</Text>
                    </View>
                  </View>

                  {/* Color Harmony Section */}
                  <View style={styles.colorHarmonySection}>
                    <View style={styles.analogicHeader}>
                      <Text style={styles.cardTitle}>Color Harmony</Text>

                      {/* Dropdown Menu */}
                      <Menu
                        visible={showAnalogicMenu}
                        onDismiss={() => setShowAnalogicMenu(false)}
                        anchor={
                          <Pressable style={styles.dropdownButton} onPress={() => setShowAnalogicMenu(true)}>
                            <Text style={styles.dropdownText}>{selectedAnalogic}</Text>
                            <IconButton icon="chevron-down" size={20} iconColor="#00ff41" style={styles.dropdownIcon} />
                          </Pressable>
                        }
                        contentStyle={styles.menuContent}
                      >
                        <Animated.View style={analogicAnimatedStyle}>
                          <Menu.Item
                            onPress={() => handleMenuItemPress("Analogic", analogicScale)}
                            title="Analogic"
                            titleStyle={styles.menuItemText}
                          />
                        </Animated.View>

                        <Animated.View style={complementaryAnimatedStyle}>
                          <Menu.Item
                            onPress={() => handleMenuItemPress("Complementary", complementaryScale)}
                            title="Complementary"
                            titleStyle={styles.menuItemText}
                          />
                        </Animated.View>

                        <Animated.View style={triadicAnimatedStyle}>
                          <Menu.Item
                            onPress={() => handleMenuItemPress("Triadic", triadicScale)}
                            title="Triadic"
                            titleStyle={styles.menuItemText}
                          />
                        </Animated.View>

                        <Animated.View style={monochromaticAnimatedStyle}>
                          <Menu.Item
                            onPress={() => handleMenuItemPress("Monochromatic", monochromaticScale)}
                            title="Monochromatic"
                            titleStyle={styles.menuItemText}
                          />
                        </Animated.View>
                      </Menu>
                    </View>

                    {/* Color Bar */}
                    <View style={styles.colorBar}>
                      {sampleColors.map((color, index) => (
                        <View
                          key={index}
                          style={[
                            styles.colorSegment,
                            {
                              backgroundColor: color,
                              shadowColor: color,
                              shadowOpacity: 0.8,
                              shadowRadius: 8,
                              elevation: 8,
                            },
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                </LinearGradient>
              </Card>
            </View>
          </View>
          </ScrollView>
        )}
      </View>

      {/* Loader Overlay */}
      {isLoading && (
        <View style={styles.loaderOverlay}>
          <BlurView intensity={20} tint="dark" style={styles.loaderBlur}>
            <View style={styles.loaderContainer}>
              <Animated.View style={[styles.loaderWrapper, loaderGlowStyle]}>
                {/* Outer rotating ring */}
                <Animated.View style={[styles.loaderOuterRing, loaderRotationStyle]}>
                  <LinearGradient
                    colors={["#00ff41", "#0080ff", "#ff00ff", "#00ff41"]}
                    style={styles.loaderRingGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                </Animated.View>

                {/* Inner pulsing circle */}
                <Animated.View style={[styles.loaderInnerCircle, loaderPulseStyle]}>
                  <LinearGradient
                    colors={["rgba(0,255,65,0.8)", "rgba(0,255,65,0.4)"]}
                    style={styles.loaderInnerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />

                  {/* Center dot */}
                  <View style={styles.loaderCenterDot} />
                </Animated.View>

                {/* Loading text */}
                <Text style={styles.loaderText}>Fetching Colors...</Text>

                {/* Shimmer effect */}
                <Animated.View style={[styles.loaderShimmer, shimmerStyle]}>
                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(0,255,65,0.4)",
                      "rgba(0,255,65,0.8)",
                      "rgba(0,255,65,0.4)",
                      "transparent",
                    ]}
                    style={styles.loaderShimmerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </Animated.View>
              </Animated.View>
            </View>
          </BlurView>
        </View>
      )}

      {/* Bottom Navigation */}
      <Surface style={[styles.bottomNavigation, { bottom: insets.bottom }]} elevation={12}>
        <LinearGradient
          colors={["#1a1a1a", "#2a2a2a"]}
          style={styles.bottomNavGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Home */}
          <Pressable
            style={styles.navItem}
            onPress={() => {
              console.log("Home pressed")
              router.replace("/")
            }}
          >
            <IconButton icon="home" size={28} iconColor="#fff" style={styles.navIcon} />
            <Text style={styles.navLabel}>Home</Text>
          </Pressable>

          {/* Captures */}
          <Pressable
            style={styles.navItem}
            onPress={() => {
              console.log("Captures pressed")
              //   router.replace('/captures');
            }}
          >
            <IconButton icon="camera-image" size={28} iconColor="#fff" style={styles.navIcon} />
            <Text style={styles.navLabel}>Captures</Text>
          </Pressable>

          {/* Color Palette */}
          <Pressable
            style={styles.navItem}
            onPress={() => {
              console.log("Color Palette pressed")
              // router.push('/palette');
            }}
          >
            <IconButton icon="palette" size={28} iconColor="#00ff41" style={styles.navIcon} />
            <Text style={styles.navLabel}>Palette</Text>
          </Pressable>

          {/* Menu */}
          <Pressable
            style={styles.navItem}
            onPress={() => {
              console.log("Menu pressed")
              // router.replace('/menu');
            }}
          >
            <IconButton icon="menu" size={28} iconColor="#fff" style={styles.navIcon} />
            <Text style={styles.navLabel}>Menu</Text>
          </Pressable>
        </LinearGradient>
      </Surface>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  mainContent: {
    flex: 1,
  },
  header: {
    backgroundColor: "transparent",
    elevation: 0,
  },
  headerGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(8),
    paddingVertical: scale(12),
  },
  backButton: {
    margin: 0,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  themeButton: {
    margin: 0,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: scale(20),
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "#00ff41",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: scale(10),
  },
  inputSection: {
    padding: scale(20),
    gap: scale(20),
    marginBottom: scale(10), // Reduced gap between fetch button and results
  },
  inputContainer: {
    position: "relative",
  },
  inputBorderShader: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: scale(17),
    zIndex: 1,
  },
  inputBorderGradient: {
    flex: 1,
    borderRadius: scale(17),
  },
  inputBlurContainer: {
    borderRadius: scale(15),
    overflow: "hidden",
    zIndex: 2,
  },
  inputGradient: {
    position: "relative",
    paddingHorizontal: scale(20),
    paddingVertical: scale(15),
  },
  inputShimmer: {
    position: "absolute",
    top: 0,
    left: -width * 0.3,
    bottom: 0,
    width: width * 0.2,
    zIndex: 3,
  },
  inputShimmerGradient: {
    flex: 1,
    width: "100%",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(15),
    zIndex: 4,
  },
  textInput: {
    flex: 1,
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "500",
    fontFamily: "monospace",
  },
  formatButton: {
    borderRadius: scale(12),
    overflow: "hidden",
  },
  formatButtonGradient: {
    paddingHorizontal: scale(15),
    paddingVertical: scale(8),
  },
  formatButtonText: {
    color: "#000",
    fontSize: scale(14),
    fontWeight: "bold",
  },
  fetchButtonContainer: {
    alignItems: "center",
  },
  fetchButton: {
    borderRadius: scale(20),
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.6,
    shadowRadius: scale(12),
  },
  fetchButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(30),
    paddingVertical: scale(15),
    gap: scale(10),
  },
  fetchButtonText: {
    color: "#fff",
    fontSize: scale(18),
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: scale(2),
  },
  fetchIcon: {
    margin: 0,
  },
  resultsSection: {
    flex: 1,
    padding: scale(20),
    paddingTop: scale(5), // Reduced top padding for closer spacing to fetch button
  },
  resultCard: {
    flex: 1,
    maxHeight: height * 0.6, // Increased height for combined content including color name
  },
  // Combined card styles
  combinedCard: {
    backgroundColor: "transparent",
    borderRadius: scale(20),
    overflow: "hidden",
    elevation: 12,
    shadowColor: "#00ff41",
    shadowOffset: { width: 0, height: scale(6) },
    shadowOpacity: 0.3,
    shadowRadius: scale(15),
  },
  combinedCardGradient: {
    padding: scale(18), // Slightly reduced padding
  },
  cardTitle: {
    color: "#fff",
    fontSize: scale(16), // Reduced font size
    fontWeight: "bold",
    marginBottom: scale(12), // Reduced margin
    textShadowColor: "#00ff41",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: scale(8),
  },
  // Color Name Section Styles
  colorNameSection: {
    marginBottom: scale(15), // Space between color name and color formats
  },
  colorNameContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: scale(12),
    paddingHorizontal: scale(15),
    paddingVertical: scale(10),
    borderWidth: 1,
    borderColor: "rgba(0,255,65,0.3)",
  },
  colorNameValue: {
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "600",
    textAlign: "center",
    textShadowColor: "rgba(0,255,65,0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: scale(5),
    textTransform: "capitalize", // Capitalize the color name
  },
  formatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(8), // Reduced margin
    paddingVertical: scale(6), // Reduced padding
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  formatLabel: {
    color: "#00ff41",
    fontSize: scale(14), // Reduced font size
    fontWeight: "600",
  },
  formatValue: {
    color: "#fff",
    fontSize: scale(14), // Reduced font size
    fontFamily: "monospace",
    textShadowColor: "rgba(0,255,65,0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: scale(5),
  },
  // Color Harmony Section
  colorHarmonySection: {
    marginTop: scale(15), // Space between sections
  },
  analogicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(12), // Reduced margin
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: scale(12), // Reduced padding
    paddingVertical: scale(6), // Reduced padding
    borderRadius: scale(10), // Reduced border radius
    borderWidth: 1,
    borderColor: "rgba(0,255,65,0.3)",
  },
  dropdownText: {
    color: "#fff",
    fontSize: scale(12), // Reduced font size
    fontWeight: "500",
  },
  dropdownIcon: {
    margin: 0,
  },
  menuContent: {
    backgroundColor: "#2a2a2a",
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: "rgba(0,255,65,0.3)",
  },
  menuItemText: {
    color: "#fff",
    fontSize: scale(14), // Reduced font size
  },
  colorBar: {
    flexDirection: "row",
    height: scale(50), // Reduced height
    borderRadius: scale(12), // Reduced border radius
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  colorSegment: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.2)",
  },
  // Loader Styles
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  loaderBlur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loaderWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: scale(120),
    height: scale(120),
  },
  loaderOuterRing: {
    position: "absolute",
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    borderWidth: 3,
    borderColor: "transparent",
    overflow: "hidden",
  },
  loaderRingGradient: {
    flex: 1,
    borderRadius: scale(50),
  },
  loaderInnerCircle: {
    position: "absolute",
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  loaderInnerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: scale(35),
  },
  loaderCenterDot: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: "#00ff41",
    shadowColor: "#00ff41",
    shadowOpacity: 0.8,
    shadowRadius: scale(10),
    elevation: 10,
  },
  loaderText: {
    position: "absolute",
    bottom: -scale(40),
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "600",
    textShadowColor: "#00ff41",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: scale(8),
  },
  loaderShimmer: {
    position: "absolute",
    top: 0,
    left: -scale(60),
    right: 0,
    bottom: 0,
    width: scale(40),
    zIndex: 5,
  },
  loaderShimmerGradient: {
    flex: 1,
    width: "100%",
  },
  bottomNavigation: {
    position: "absolute",
    left: 0,
    right: 0,
    height: scale(70),
    backgroundColor: "transparent",
    elevation: 0,
  },
  bottomNavGradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: Math.max(scale(8), width * 0.02),
    paddingVertical: Math.max(scale(5), height * 0.008),
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navIcon: {
    margin: 0,
    backgroundColor: "rgba(255,255,255,0.1)",
    width: Math.max(scale(40), width * 0.1),
    height: Math.max(scale(40), width * 0.1),
  },
  navLabel: {
    color: "#fff",
    fontSize: Math.max(scale(10), width * 0.028),
    fontWeight: "500",
    marginTop: 2,
    textShadowColor: "rgba(0,255,65,0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: scale(5),
  },
  formatContainer: {
    // Removed minWidth constraint and ScrollView styles
    width: "100%",
  },
})
