// "use client"

import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import { useNavigationContainerRef, useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Dimensions, Pressable, SafeAreaView, type ScrollView, StatusBar, StyleSheet, View } from "react-native"
import { Card, IconButton, Surface, Text } from "react-native-paper"
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import PermissionPopup from "./components/CameraScreen/cameraPop-up" // adjust path if needed
import { useSelector, UseSelector } from "react-redux";
import { useCameraPermission } from "react-native-vision-camera"










const { width, height } = Dimensions.get("window")
const CARD_WIDTH = width * 0.75
const CARD_SPACING = 25

// Enhanced color palettes with darker, more vibrant colors
const colorPalettes = [
  { id: 1, name: "Neon Ocean", colors: ["#0066ff", "#00ccff", "#ff00ff"] },
  { id: 2, name: "Cyber Sunset", colors: ["#ff0080", "#ff4000", "#ffff00"] },
  { id: 3, name: "Matrix Green", colors: ["#00ff41", "#008f11", "#39ff14"] },
  { id: 4, name: "Purple Haze", colors: ["#8a2be2", "#4b0082", "#9400d3"] },
  { id: 5, name: "Electric Gold", colors: ["#ffd700", "#ff8c00", "#ffff00"] },
  { id: 6, name: "Ice Blue", colors: ["#00bfff", "#1e90ff", "#87ceeb"] },
  { id: 7, name: "Hot Pink", colors: ["#ff1493", "#ff69b4", "#ff6347"] },
  { id: 8, name: "Neon Mint", colors: ["#00ff7f", "#00fa9a", "#7fffd4"] },
]

export default function ColoryHome() {
//redux utilities//
// const permissionState = useSelector((state)=>{return state.permissionState})



//on loading of home screen, we will check whther user has granted camera permission//
const { hasPermission, requestPermission } = useCameraPermission();

//popup related activities//
const[understand, setUnderstand]=useState(false)



  const router = useRouter()
  const insets = useSafeAreaInsets()
 const navRef = useNavigationContainerRef();
  // for permission popup
  const [showPermissionPopup, setShowPermissionPopup] = useState(false)

  console.log("Available Routes", navRef.getCurrentRoute());
  // Animation values for cards
  const scrollX = useSharedValue(0)
  const cardAnimation = useSharedValue(0)
  const glowAnimation = useSharedValue(0)
  const pulseAnimation = useSharedValue(0)
  const borderShaderAnimation = useSharedValue(0)
  const cameraShaderAnimation = useSharedValue(0)
  const autoScrollRef = useRef<ScrollView>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const [isDarkTheme, setIsDarkTheme] = useState(true)

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
    // Start animations
    cardAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
        withTiming(0, { duration: 3000, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
      ),
      -1,
      true,
    )

    glowAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sine) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sine) }),
      ),
      -1,
      true,
    )

    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    )

    borderShaderAnimation.value = withRepeat(
      withSequence(withTiming(1, { duration: 2500, easing: Easing.linear }), withTiming(0, { duration: 0 })),
      -1,
      false,
    )

    cameraShaderAnimation.value = withRepeat(
      withSequence(withTiming(1, { duration: 3000, easing: Easing.linear }), withTiming(0, { duration: 0 })),
      -1,
      false,
    )
  }, [])

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

  // Camera shader animation styles
  const cameraShaderStyle = useAnimatedStyle(() => {
    const translateX = interpolate(cameraShaderAnimation.value, [0, 1], [-width * 1.5, width * 1.5], "clamp")
    const opacity = interpolate(cameraShaderAnimation.value, [0, 0.3, 0.7, 1], [0, 0.8, 0.8, 0], "clamp")
    return {
      transform: [{ translateX }],
      opacity,
    }
  })

  const cameraBorderShaderStyle = useAnimatedStyle(() => {
    const rotation = interpolate(cameraShaderAnimation.value, [0, 1], [0, 360], "clamp")
    return {
      transform: [{ rotate: `${rotation}deg` }],
    }
  })

  // Enhanced animated card component
  const AnimatedCard = ({ item, index }: { item: any; index: number }) => {
    const cardStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * (CARD_WIDTH + CARD_SPACING),
        index * (CARD_WIDTH + CARD_SPACING),
        (index + 1) * (CARD_WIDTH + CARD_SPACING),
      ]
      const scale = interpolate(scrollX.value, inputRange, [0.9, 1.05, 0.9], "clamp")
      const opacity = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], "clamp")
      const rotateY = interpolate(scrollX.value, inputRange, [15, 0, -15], "clamp")
      const translateY = interpolate(scrollX.value, inputRange, [10, 0, 10], "clamp")
      return {
        transform: [
          { scale: scale * interpolate(pulseAnimation.value, [0, 1], [1, 1.01], "clamp") },
          { perspective: 1000 },
          { rotateY: `${rotateY}deg` },
          { translateY },
        ],
        opacity,
      }
    })

    const shimmerStyle = useAnimatedStyle(() => {
      const translateX = interpolate(cardAnimation.value, [0, 1], [-CARD_WIDTH * 1.2, CARD_WIDTH * 1.2], "clamp")
      const opacity = interpolate(cardAnimation.value, [0, 0.5, 1], [0, 0.6, 0], "clamp")
      return {
        transform: [{ translateX }],
        opacity,
      }
    })

    const glowStyle = useAnimatedStyle(() => {
      const glowOpacity = interpolate(glowAnimation.value, [0, 1], [0.4, 0.9], "clamp")
      const glowScale = interpolate(glowAnimation.value, [0, 1], [1, 1.03], "clamp")
      return {
        opacity: glowOpacity,
        transform: [{ scale: glowScale }],
      }
    })

    const floatingStyle = useAnimatedStyle(() => {
      const floatY = interpolate(cardAnimation.value, [0, 1], [0, -8], "clamp")
      return {
        transform: [{ translateY: floatY }],
      }
    })

    const borderShaderStyle = useAnimatedStyle(() => {
      const rotation = interpolate(borderShaderAnimation.value, [0, 1], [0, 360], "clamp")
      return {
        transform: [{ rotate: `${rotation}deg` }],
      }
    })

    return (
      <Animated.View style={[styles.cardWrapper, cardStyle]}>
        {/* Animated border shader */}
        <Animated.View style={[styles.borderShader, borderShaderStyle]}>
          <LinearGradient
            colors={[item.colors[0], item.colors[1], item.colors[2], item.colors[0]]}
            style={styles.borderShaderGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
        <Animated.View style={floatingStyle}>
          <Card style={[styles.colorCard, { backgroundColor: "#1a1a1a" }]}>
            <View style={styles.cardContent}>
              <LinearGradient
                colors={item.colors}
                style={styles.gradientBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Enhanced shimmer effect */}
                <Animated.View style={[styles.shimmerOverlay, shimmerStyle]}>
                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(255,255,255,0.4)",
                      "rgba(255,255,255,0.8)",
                      "rgba(255,255,255,0.4)",
                      "transparent",
                    ]}
                    style={styles.shimmerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </Animated.View>

                {/* Enhanced glow overlay */}
                <Animated.View style={[styles.glowOverlay, glowStyle]}>
                  <LinearGradient
                    colors={[
                      "transparent",
                      `${item.colors[0]}20`,
                      `${item.colors[1]}15`,
                      `${item.colors[2]}20`,
                      "transparent",
                    ]}
                    style={styles.glowGradient}
                  />
                </Animated.View>

                <BlurView intensity={35} tint="dark" style={styles.cardTextContainer}>
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
                            shadowOpacity: 0.9,
                            shadowRadius: 10,
                            elevation: 10,
                          },
                          {
                            transform: [
                              {
                                scale: interpolate(cardAnimation.value, [0, 0.5, 1], [1, 1.2, 1], "clamp"),
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
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Header */}
            <Surface style={[styles.header, { paddingTop: insets.top || 12 }]} elevation={8}>
          <LinearGradient
            colors={["#1a1a1a", "#2a2a2a"]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Theme Toggle Button */}
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

            {/* Title */}
            <Text style={styles.title}>LOOXA</Text>

            {/* FAQ Button */}
            <IconButton
              icon="help-circle-outline"
              size={24}
              iconColor="#fff"
              onPress={() => {
                console.log("FAQ pressed")
                // router.push('/faq'); // Navigate to FAQ page
              }}
              style={styles.faqButton}
            />
          </LinearGradient>
        </Surface>

        {/* Enhanced Camera Section */}
        <Pressable style={styles.cameraSection} onPress={() => console.log("Open Camera")}>
          <View style={styles.cameraContainer}>
            {/* Camera Border Shader */}
            <Animated.View style={[styles.cameraBorderShader, cameraBorderShaderStyle]}>
              <LinearGradient
                colors={["#667eea", "#764ba2", "#f093fb", "#667eea"]}
                style={styles.cameraBorderGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
            <Surface style={styles.cameraSurface} elevation={12}>
              <LinearGradient
                colors={["#667eea", "#764ba2", "#f093fb"]}
                style={styles.cameraGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Camera Shimmer Effect */}
                <Animated.View style={[styles.cameraShimmer, cameraShaderStyle]}>
                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(255,255,255,0.3)",
                      "rgba(255,255,255,0.7)",
                      "rgba(255,255,255,0.3)",
                      "transparent",
                    ]}
                    style={styles.cameraShimmerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </Animated.View>

                {/* Camera glow effect */}
                <Animated.View
                  style={[
                    styles.cameraGlow,
                    {
                      opacity: interpolate(glowAnimation.value, [0, 1], [0.6, 1], "clamp"),
                      transform: [
                        {
                          scale: interpolate(glowAnimation.value, [0, 1], [1, 1.03], "clamp"),
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
                    if (!hasPermission) {
                      setShowPermissionPopup(true)
                    } else {
                      router.push("/CameraScreen")
                    }
                  }}
                     
                    
                  />
                  {/* <CameraPermissionPopup visible={showPopup} onClose={() => setShowPopup(false)} /> */}
                </Animated.View>
                <Text style={styles.cameraText}>Open Camera</Text>
                <Text style={styles.cameraSubtext}>Detect colors in real-time</Text>
              </LinearGradient>
            </Surface>
          </View>
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
                  opacity: interpolate(glowAnimation.value, [0, 1], [0.7, 1], "clamp"),
                },
              ]}
            >
              <Pressable onPress={swipeRight} style={styles.sideSwipeButton}>
                <LinearGradient colors={["rgba(0,255,65,0.2)", "rgba(0,255,65,0.1)"]} style={styles.sideSwipeGradient}>
                  <IconButton icon="chevron-left" size={28} iconColor="#00ff41" style={styles.sideSwipeIcon} />
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
                  opacity: interpolate(glowAnimation.value, [0, 1], [0.7, 1], "clamp"),
                },
              ]}
            >
              <Pressable onPress={swipeLeft} style={styles.sideSwipeButton}>
                <LinearGradient colors={["rgba(0,255,65,0.2)", "rgba(0,255,65,0.1)"]} style={styles.sideSwipeGradient}>
                  <IconButton icon="chevron-right" size={28} iconColor="#00ff41" style={styles.sideSwipeIcon} />
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
                    backgroundColor: currentIndex === index ? "#00ff41" : "#666",
                    shadowColor: currentIndex === index ? "#00ff41" : "transparent",
                    shadowOpacity: 0.9,
                    shadowRadius: 10,
                    elevation: currentIndex === index ? 10 : 0,
                    transform: [
                      {
                        scale: currentIndex === index ? 1.4 : 1,
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Bottom Navigation */}
          <Surface style={[styles.bottomNavigation, { paddingBottom: insets.bottom || 12 }]} elevation={12}>
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
              // router.push('/'); // Navigate to home
            }}
          >
            <IconButton icon="home" size={28} iconColor="#00ff41" style={styles.navIcon} />
            <Text style={styles.navLabel}>Home</Text>
          </Pressable>

          {/* Captures */}
         
          <Pressable
            style={styles.navItem}
            // onPress={async() => {
            //       console.log("Captures pressed")
             
            //     const response = await fetch(`https://www.thecolorapi.com/scheme?hex=0047AB&mode=analogic&count=5`);
            //       const data = await response.json();
              
            //      console.log("this is the response we got as api", data.colors[0].hex.value)
              // router.push('/captures'); // Navigate to captures
              onPress={
                ()=>{router.push('/ColorOverlayScreen')}
              }
            
          >          
            <IconButton icon="camera-image" size={28} iconColor="#fff" style={styles.navIcon} />
            <Text style={styles.navLabel}>Captures</Text>
          </Pressable>
      
          {/* Color Palette */}
          <Pressable
            style={styles.navItem}
            onPress={() => {              
                router.push('/ColorPalette') // Navigate to color palette
               console.log("Color Palette pressed")
            }}
          >
            <IconButton icon="palette" size={28} iconColor="#fff" style={styles.navIcon} />
            <Text style={styles.navLabel}>Palette</Text>
          </Pressable>

          {/* Menu */}
          <Pressable
            style={styles.navItem}
            onPress={() => {
              console.log("Menu pressed")
              // router.push('/menu'); // Navigate to menu
            }}
          >
            <IconButton icon="menu" size={28} iconColor="#fff" style={styles.navIcon} />
            <Text style={styles.navLabel}>Menu</Text>
          </Pressable>

          {/* Settings
          <Pressable
            style={styles.navItem}
            onPress={() => {
              console.log("Settings pressed")
              // router.push('/settings'); // Navigate to settings
            }}
          >
            <IconButton icon="cog" size={28} iconColor="#fff" style={styles.navIcon} />
            <Text style={styles.navLabel}>Settings</Text>
          </Pressable> */}
        </LinearGradient>
      </Surface>



                    <PermissionPopup
                  visible={showPermissionPopup}
                  onClose={() => setShowPermissionPopup(false)}
                  onUnderstand={async () => {
                    setUnderstand(true)
                    setShowPermissionPopup(false)

                    const granted = await requestPermission()
                    if (granted) {
                      router.push("/CameraScreen")
                    } else {
                      // You can show another message or retry option
                      console.log("Permission denied")
                    }
                  }}
          />
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
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  themeButton: {
    margin: 0,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  faqButton: {
    margin: 0,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "#00ff41",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  cameraSection: {
    padding: 20,
  },
  cameraContainer: {
    position: "relative",
  },
  cameraBorderShader: {
    position: "absolute",
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 28,
    zIndex: 1,
  },
  cameraBorderGradient: {
    flex: 1,
    borderRadius: 28,
    opacity: 0.7,
  },
  cameraSurface: {
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "transparent",
    zIndex: 2,
  },
  cameraGradient: {
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cameraShimmer: {
    position: "absolute",
    top: 0,
    left: -width * 0.5,
    right: 0,
    bottom: 0,
    width: width * 0.4,
    zIndex: 3,
  },
  cameraShimmerGradient: {
    flex: 1,
    width: "100%",
  },
  cameraGlow: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 50,
    padding: 5,
    marginBottom: 15,
    zIndex: 4,
  },
  cameraIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  cameraText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    zIndex: 4,
  },
  cameraSubtext: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    zIndex: 4,
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
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    textShadowColor: "#00ff41",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
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
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#00ff41",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  sideSwipeGradient: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(0,255,65,0.4)",
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
  borderShader: {
    position: "absolute",
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 33,
    zIndex: 1,
  },
  borderShaderGradient: {
    flex: 1,
    borderRadius: 33,
    opacity: 0.8,
  },
  colorCard: {
    height: 220,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.7,
    shadowRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
    zIndex: 2,
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
    borderRadius: 20,
    margin: 15,
    overflow: "hidden",
    zIndex: 4,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  colorDots: {
    flexDirection: "row",
    gap: 10,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    gap: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
bottomNavigation: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "transparent",
  elevation: 0,
},
bottomNavGradient: {
  flex: 1,
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  paddingHorizontal: Math.max(8, width * 0.02),
  paddingVertical: Math.max(5, height * 0.008),
},
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navIcon: {
    margin: 0,
    backgroundColor: "rgba(255,255,255,0.1)",
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
  },
  navLabel: {
    color: "#fff",
    fontSize: Math.max(10, width * 0.028), // Responsive font size
    fontWeight: "500",
    marginTop: 2,
    textShadowColor: "rgba(0,255,65,0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
})
