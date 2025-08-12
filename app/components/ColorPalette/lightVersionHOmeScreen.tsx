"use client"

import { useEffect, useRef, useState } from "react"
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  Pressable,
  type ScrollView,
  StatusBar,
} from "react-native"
import { IconButton, Drawer, Card, Text, Divider, Surface } from "react-native-paper"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  useAnimatedScrollHandler,
  runOnJS,
  Easing,
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { useRouter } from "expo-router"

const { width, height } = Dimensions.get("window")
const LEFT_DRAWER_WIDTH = width * 0.75
const RIGHT_DRAWER_WIDTH = width * 0.75
const CARD_WIDTH = width * 0.75
const CARD_SPACING = 15

// Beautiful, aesthetic color palettes inspired by nature and art
const colorPalettes = [
  { id: 1, name: "Sunset Blush", colors: ["#FF9A8B", "#FECFEF", "#FECFEF"] },
  { id: 2, name: "Ocean Breeze", colors: ["#A8E6CF", "#7FCDCD", "#81C7D4"] },
  { id: 3, name: "Lavender Dreams", colors: ["#C7CEEA", "#B19CD9", "#FFB6C1"] },
  { id: 4, name: "Autumn Warmth", colors: ["#FFB347", "#FFCC5C", "#FF6B6B"] },
  { id: 5, name: "Spring Garden", colors: ["#98FB98", "#F0E68C", "#DDA0DD"] },
  { id: 6, name: "Rose Gold", colors: ["#F7CAC9", "#F7786B", "#C94A4A"] },
  { id: 7, name: "Mint Fresh", colors: ["#AAFFC3", "#DCE35B", "#45B7D1"] },
  { id: 8, name: "Peachy Keen", colors: ["#FFDFBA", "#FFAAA5", "#FF8B94"] },
]

export default function ColoryHome() {
  const leftDrawerX = useSharedValue(-LEFT_DRAWER_WIDTH)
  const rightDrawerX = useSharedValue(RIGHT_DRAWER_WIDTH)
  const isLeftDrawerOpen = useSharedValue(false)
  const isRightDrawerOpen = useSharedValue(false)
  const router = useRouter()

  // Animation values for cards
  const scrollX = useSharedValue(0)
  const cardAnimation = useSharedValue(0)
  const glowAnimation = useSharedValue(0)
  const pulseAnimation = useSharedValue(0)
  const floatAnimation = useSharedValue(0)
  const autoScrollRef = useRef<ScrollView>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAutoScrolling && autoScrollRef.current) {
        const nextIndex = (currentIndex + 1) % colorPalettes.length
        const scrollToX = nextIndex * (CARD_WIDTH + CARD_SPACING)

        autoScrollRef.current.scrollTo({
          x: scrollToX,
          animated: true,
        })

        setCurrentIndex(nextIndex)
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [currentIndex, isAutoScrolling])

  useEffect(() => {
    // Gentle floating animation
    cardAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
        withTiming(0, { duration: 4000, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
      ),
      -1,
      true,
    )

    // Soft glow animation
    glowAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sine) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sine) }),
      ),
      -1,
      true,
    )

    // Gentle pulse animation
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    )

    // Floating animation
    floatAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.sine) }),
        withTiming(0, { duration: 3500, easing: Easing.inOut(Easing.sine) }),
      ),
      -1,
      true,
    )
  }, [])

  const openLeftDrawer = () => {
    leftDrawerX.value = withTiming(0, { duration: 300 })
    isLeftDrawerOpen.value = true
  }

  const closeLeftDrawer = () => {
    leftDrawerX.value = withTiming(-LEFT_DRAWER_WIDTH, { duration: 300 })
    isLeftDrawerOpen.value = false
  }

  const openRightDrawer = () => {
    rightDrawerX.value = withTiming(0, { duration: 300 })
    isRightDrawerOpen.value = true
  }

  const closeRightDrawer = () => {
    rightDrawerX.value = withTiming(RIGHT_DRAWER_WIDTH, { duration: 300 })
    isRightDrawerOpen.value = false
  }

  const leftDrawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftDrawerX.value }],
  }))

  const rightDrawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightDrawerX.value }],
  }))

  // Enhanced scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
    },
    onBeginDrag: () => {
      runOnJS(setIsAutoScrolling)(false)
    },
    onEndDrag: () => {
      runOnJS(setTimeout)(() => {
        runOnJS(setIsAutoScrolling)(true)
      }, 6000)
    },
  })

  // Manual swipe functions
  const swipeLeft = () => {
    const nextIndex = (currentIndex + 1) % colorPalettes.length
    const scrollToX = nextIndex * (CARD_WIDTH + CARD_SPACING)

    autoScrollRef.current?.scrollTo({
      x: scrollToX,
      animated: true,
    })

    setCurrentIndex(nextIndex)
  }

  const swipeRight = () => {
    const prevIndex = currentIndex === 0 ? colorPalettes.length - 1 : currentIndex - 1
    const scrollToX = prevIndex * (CARD_WIDTH + CARD_SPACING)

    autoScrollRef.current?.scrollTo({
      x: scrollToX,
      animated: true,
    })

    setCurrentIndex(prevIndex)
  }

  // Enhanced animated card component
  const AnimatedCard = ({ item, index }: { item: any; index: number }) => {
    const cardStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * (CARD_WIDTH + CARD_SPACING),
        index * (CARD_WIDTH + CARD_SPACING),
        (index + 1) * (CARD_WIDTH + CARD_SPACING),
      ]

      const scale = interpolate(scrollX.value, inputRange, [0.92, 1.05, 0.92], "clamp")

      const opacity = interpolate(scrollX.value, inputRange, [0.7, 1, 0.7], "clamp")

      const rotateY = interpolate(scrollX.value, inputRange, [8, 0, -8], "clamp")

      return {
        transform: [
          { scale: scale * interpolate(pulseAnimation.value, [0, 1], [1, 1.01], "clamp") },
          { perspective: 1000 },
          { rotateY: `${rotateY}deg` },
        ],
        opacity,
      }
    })

    const shimmerStyle = useAnimatedStyle(() => {
      const translateX = interpolate(cardAnimation.value, [0, 1], [-CARD_WIDTH * 1.2, CARD_WIDTH * 1.2], "clamp")

      const opacity = interpolate(cardAnimation.value, [0, 0.5, 1], [0, 0.3, 0], "clamp")

      return {
        transform: [{ translateX }],
        opacity,
      }
    })

    // Gentle glow animation
    const glowStyle = useAnimatedStyle(() => {
      const glowOpacity = interpolate(glowAnimation.value, [0, 1], [0.8, 1], "clamp")

      return {
        opacity: glowOpacity,
      }
    })

    // Floating animation
    const floatingStyle = useAnimatedStyle(() => {
      const floatY = interpolate(floatAnimation.value, [0, 1], [0, -6], "clamp")

      return {
        transform: [{ translateY: floatY }],
      }
    })

    return (
      <Animated.View style={[styles.cardWrapper, cardStyle]}>
        <Animated.View style={floatingStyle}>
          <Card style={[styles.colorCard, { backgroundColor: "#ffffff" }]}>
            <View style={styles.cardContent}>
              <LinearGradient
                colors={item.colors}
                style={styles.gradientBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Gentle shimmer effect */}
                <Animated.View style={[styles.shimmerOverlay, shimmerStyle]}>
                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(255,255,255,0.2)",
                      "rgba(255,255,255,0.4)",
                      "rgba(255,255,255,0.2)",
                      "transparent",
                    ]}
                    style={styles.shimmerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </Animated.View>

                {/* Soft glow overlay */}
                <Animated.View style={[styles.glowOverlay, glowStyle]}>
                  <LinearGradient
                    colors={[
                      "transparent",
                      `${item.colors[0]}10`,
                      `${item.colors[1]}08`,
                      `${item.colors[2]}10`,
                      "transparent",
                    ]}
                    style={styles.glowGradient}
                  />
                </Animated.View>

                <BlurView intensity={20} tint="light" style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <View style={styles.colorDots}>
                    {item.colors.map((color: string, idx: number) => (
                      <Animated.View
                        key={idx}
                        style={[
                          styles.colorDot,
                          {
                            backgroundColor: color,
                            shadowColor: color,
                            shadowOpacity: 0.4,
                            shadowRadius: 6,
                            elevation: 6,
                          },
                          {
                            transform: [
                              {
                                scale: interpolate(cardAnimation.value, [0, 0.5, 1], [1, 1.1, 1], "clamp"),
                              },
                            ],
                          },
                        ]}
                      />
                    ))}
                  </View>
                </BlurView>
              </LinearGradient>
            </View>
          </Card>
        </Animated.View>
      </Animated.View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Header */}
        <Surface style={styles.header} elevation={2}>
          <LinearGradient
            colors={["#ffffff", "#f8f9fa"]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <IconButton
              icon="menu"
              size={24}
              iconColor="#6c757d"
              onPress={() => {
                console.log("Menu button pressed")
                openLeftDrawer()
              }}
              style={styles.menuButton}
            />
            <Text style={styles.title}>Colory</Text>
            <IconButton
              icon="cog"
              size={24}
              iconColor="#6c757d"
              onPress={openRightDrawer}
              style={styles.settingsButton}
            />
          </LinearGradient>
        </Surface>

        {/* Enhanced Camera Section */}
        <Pressable style={styles.cameraSection} onPress={() => console.log("Open Camera")}>
          <Surface style={styles.cameraSurface} elevation={8}>
            <LinearGradient
              colors={["#FF9A8B", "#A8E6CF", "#C7CEEA"]}
              style={styles.cameraGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Camera glow effect */}
              <Animated.View
                style={[
                  styles.cameraGlow,
                  {
                    opacity: interpolate(glowAnimation.value, [0, 1], [0.9, 1], "clamp"),
                    transform: [
                      {
                        scale: interpolate(glowAnimation.value, [0, 1], [1, 1.02], "clamp"),
                      },
                    ],
                  },
                ]}
              >
                <IconButton
                  icon="camera"
                  size={40}
                  iconColor="#fff"
                  style={styles.cameraIcon}
                  onPress={() => {
                    console.log("Camera button pressed")
                    // router.push('/CameraScreen'); // Uncomment when you have the route set up
                  }}
                />
              </Animated.View>
              <Text style={styles.cameraText}>Open Camera</Text>
              <Text style={styles.cameraSubtext}>Discover beautiful colors around you</Text>
            </LinearGradient>
          </Surface>
        </Pressable>

        {/* Color Palettes Section */}
        <View style={styles.palettesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Color Palettes</Text>
          </View>

          {/* Cards Container with Side Controls */}
          <View style={styles.cardsContainer}>
            {/* Left Swipe Control */}
            <Animated.View
              style={[
                styles.leftSwipeControl,
                {
                  opacity: interpolate(glowAnimation.value, [0, 1], [0.8, 1], "clamp"),
                },
              ]}
            >
              <Pressable onPress={swipeRight} style={styles.sideSwipeButton}>
                <LinearGradient
                  colors={["rgba(255,154,139,0.2)", "rgba(255,154,139,0.1)"]}
                  style={styles.sideSwipeGradient}
                >
                  <IconButton icon="chevron-left" size={28} iconColor="#FF9A8B" style={styles.sideSwipeIcon} />
                </LinearGradient>
              </Pressable>
            </Animated.View>

            {/* Scroll View */}
            <Animated.ScrollView
              ref={autoScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + CARD_SPACING}
              snapToAlignment="center"
              decelerationRate={0.9}
              contentContainerStyle={styles.scrollContent}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              pagingEnabled={false}
              style={styles.scrollView}
            >
              {colorPalettes.map((item, index) => (
                <AnimatedCard key={item.id} item={item} index={index} />
              ))}
            </Animated.ScrollView>

            {/* Right Swipe Control */}
            <Animated.View
              style={[
                styles.rightSwipeControl,
                {
                  opacity: interpolate(glowAnimation.value, [0, 1], [0.8, 1], "clamp"),
                },
              ]}
            >
              <Pressable onPress={swipeLeft} style={styles.sideSwipeButton}>
                <LinearGradient
                  colors={["rgba(255,154,139,0.2)", "rgba(255,154,139,0.1)"]}
                  style={styles.sideSwipeGradient}
                >
                  <IconButton icon="chevron-right" size={28} iconColor="#FF9A8B" style={styles.sideSwipeIcon} />
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </View>

          {/* Enhanced pagination dots */}
          <View style={styles.pagination}>
            {colorPalettes.map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    opacity: currentIndex === index ? 1 : 0.4,
                    backgroundColor: currentIndex === index ? "#FF9A8B" : "#dee2e6",
                    shadowColor: currentIndex === index ? "#FF9A8B" : "transparent",
                    shadowOpacity: 0.4,
                    shadowRadius: 6,
                    elevation: currentIndex === index ? 6 : 0,
                    transform: [
                      {
                        scale: currentIndex === index ? 1.3 : 1,
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Enhanced overlay for drawers */}
      {(isLeftDrawerOpen.value || isRightDrawerOpen.value) && (
        <TouchableWithoutFeedback
          onPress={() => {
            closeLeftDrawer()
            closeRightDrawer()
          }}
        >
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Left Drawer */}
      <Animated.View style={[styles.leftDrawer, leftDrawerStyle]}>
        <View style={styles.drawerContent}>
          <LinearGradient colors={["#1a1a1a", "#2a2a2a"]} style={styles.drawerGradient}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <IconButton icon="close" iconColor="#fff" onPress={closeLeftDrawer} />
            </View>
            <Divider style={{ backgroundColor: "#444", marginVertical: 10 }} />

            <Pressable
              style={styles.drawerItem}
              onPress={() => {
                console.log("Home Pressed")
                closeLeftDrawer()
              }}
            >
              <Text style={styles.drawerItemText}>🏠 Home</Text>
            </Pressable>

            <Pressable
              style={styles.drawerItem}
              onPress={() => {
                console.log("Palettes Pressed")
                closeLeftDrawer()
              }}
            >
              <Text style={styles.drawerItemText}>🎨 My Palettes</Text>
            </Pressable>

            <Pressable
              style={styles.drawerItem}
              onPress={() => {
                console.log("History Pressed")
                closeLeftDrawer()
              }}
            >
              <Text style={styles.drawerItemText}>📝 Recent Colors</Text>
            </Pressable>

            <Pressable
              style={styles.drawerItem}
              onPress={() => {
                console.log("Profile Pressed")
                closeLeftDrawer()
              }}
            >
              <Text style={styles.drawerItemText}>👤 Profile</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </Animated.View>

      {/* Right Drawer */}
      <Animated.View style={[styles.rightDrawer, rightDrawerStyle]}>
        <BlurView intensity={80} tint="light" style={styles.drawerContent}>
          <LinearGradient colors={["#ffffff", "#f8f9fa"]} style={styles.drawerGradient}>
            <View style={styles.drawerHeader}>
              <IconButton icon="close" iconColor="#6c757d" onPress={closeRightDrawer} />
              <Text style={styles.drawerTitle}>Settings</Text>
            </View>
            <Divider style={{ backgroundColor: "#dee2e6" }} />
            <Drawer.CollapsedItem
              focusedIcon="theme-light-dark"
              label="Theme"
              labelStyle={{ color: "#495057" }}
              onPress={() => {
                console.log("Theme Pressed")
                closeRightDrawer()
              }}
            />
            <Drawer.CollapsedItem
              focusedIcon="camera-outline"
              label="Camera Settings"
              labelStyle={{ color: "#495057" }}
              onPress={() => {
                console.log("Camera Settings Pressed")
                closeRightDrawer()
              }}
            />
            <Drawer.CollapsedItem
              focusedIcon="format-color-fill"
              label="Color Format"
              labelStyle={{ color: "#495057" }}
              onPress={() => {
                console.log("Color Format Pressed")
                closeRightDrawer()
              }}
            />
            <Drawer.CollapsedItem
              focusedIcon="information"
              label="About"
              labelStyle={{ color: "#495057" }}
              onPress={() => {
                console.log("About Pressed")
                closeRightDrawer()
              }}
            />
          </LinearGradient>
        </BlurView>
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    marginTop: 25,
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
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  menuButton: {
    margin: 0,
    backgroundColor: "rgba(108,117,125,0.1)",
  },
  settingsButton: {
    margin: 0,
    backgroundColor: "rgba(108,117,125,0.1)",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#495057",
    letterSpacing: 0.5,
  },
  cameraSection: {
    padding: 20,
  },
  cameraSurface: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  cameraGradient: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cameraGlow: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 50,
    padding: 8,
    marginBottom: 15,
  },
  cameraIcon: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  cameraText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cameraSubtext: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  palettesSection: {
    flex: 1,
    paddingTop: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#495057",
    letterSpacing: 0.3,
  },
  cardsContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 280,
  },
  leftSwipeControl: {
    position: "absolute",
    left: 10,
    zIndex: 10,
    height: "100%",
    justifyContent: "center",
  },
  rightSwipeControl: {
    position: "absolute",
    right: 10,
    zIndex: 10,
    height: "100%",
    justifyContent: "center",
  },
  sideSwipeButton: {
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#FF9A8B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sideSwipeGradient: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,154,139,0.3)",
  },
  sideSwipeIcon: {
    margin: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: width * 0.125,
    paddingVertical: 20,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
    position: "relative",
  },
  colorCard: {
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cardContent: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    position: "relative",
    justifyContent: "flex-end",
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: -CARD_WIDTH * 0.4,
    right: 0,
    bottom: 0,
    width: CARD_WIDTH * 0.3,
    zIndex: 3,
  },
  shimmerGradient: {
    flex: 1,
    width: "100%",
  },
  glowOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  glowGradient: {
    flex: 1,
  },
  cardTextContainer: {
    padding: 20,
    borderRadius: 15,
    margin: 15,
    overflow: "hidden",
    zIndex: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 12,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  colorDots: {
    flexDirection: "row",
    gap: 10,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    gap: 12,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  leftDrawer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: height,
    width: LEFT_DRAWER_WIDTH,
    zIndex: 1000, // Increased z-index
    backgroundColor: "rgba(26,26,26,0.95)", // Add fallback background
  },
  rightDrawer: {
    position: "absolute",
    top: 0,
    right: 0,
    height: height,
    width: RIGHT_DRAWER_WIDTH,
    zIndex: 1000, // Increased z-index
    backgroundColor: "rgba(26,26,26,0.95)", // Add fallback background
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: 999, // Just below drawers
  },
  drawerContent: {
    flex: 1,
    backgroundColor: "transparent",
  },
  drawerGradient: {
    flex: 1,
    paddingTop: 60,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#495057",
    letterSpacing: 0.3,
  },
  drawerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  drawerItemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
})
