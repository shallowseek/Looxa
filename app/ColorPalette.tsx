import { Stack } from 'expo-router'
import ColorPalette from './components/ColorPalette/index'

export default function ColorPaletteScreen() {
  return (
    <>
      {/* This Stack.Screen only affects this file */}
      <Stack.Screen options={{ headerShown: false }} />
      <ColorPalette />
    </>
  )
}
