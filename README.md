# Looxa – Real-Time Color Detection & AR Integration

Looxa is a mobile app built with React Native for real-time color detection using the device camera. It processes live frames to detect average colors and stabilizes color output for smooth user experience. The app plans to integrate machine learning-powered augmented reality (AR) features for interactive color manipulation.

---

## Features

- Real-time detection and display of colors from live camera feed  
- Frame averaging to stabilize color output and reduce flicker  
- Hex and RGB color mode toggling  
- Flashlight toggle and zoom controls  
- Interactive UI with animated glow and shimmer effects  
- Future plans to integrate object segmentation and AR recoloring  
- Fully on-device processing without needing internet  

---

## Installation

```bash
git clone https://github.com/shallowseek/looxa.git
cd looxa
npm install
# or yarn install
npm run android
# or npm run ios
Usage
Launch the app and allow camera permissions

Point your camera at any surface to detect color

Use flash toggle and zoom controls for precision

Tap and hold (planned feature) for AR color overlay

Tech Stack
React Native with Expo

react-native-vision-camera (camera & frame processing)

@shopify/react-native-skia (graphics & drawing overlays)

Redux Toolkit & Redux Thunk (state management)

React Native Paper & Dripsy (UI components and theming)

EAS Build, WSL, Node.js for development environment

Roadmap
Finalize AR object segmentation and recoloring

Add user controls for color palette and overlays

Optimize performance for smoother frame processing

Publish on app stores with monetization strategies

License
MIT License (see LICENSE file)

Contact
Jatin Gaur
Email: gaurjatin74@gmail.com
GitHub: github.com/shallowseek
LinkedIn: linkedin.com/in/yourlinkedin
