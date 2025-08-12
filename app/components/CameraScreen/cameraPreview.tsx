import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Camera } from 'react-native-vision-camera'
// import { Camera as C} from 'expo-camera';//fot flashlight

// type props:{
//   device:Camera.,

// }




const CameraPreview = ({device, cameraRef,children,display,fProcessor,flash,formats}) => {


  return (
    <>

      <Camera
        style={[StyleSheet.absoluteFill,styles.camera]}
        isActive={true}
        torch={flash === 'on' ? 'on' : 'off'}
        resizeMode={display} // better than 'contain' for full-screen
        //giving option to user to set mode//
        ref={cameraRef}
        photo={true}
        device={device}
        exposure={0}
        frameProcessor={fProcessor}
        //  animatedProps={animatedProps}
        // format={formats}
        // fps={fps}
        enableZoomGesture={true}
        // zoom={}
      />
      
      {/* ✅ render overlay children ABOVE the camera */}
      {children}

    </>
  )
}

export default CameraPreview

const styles = StyleSheet.create({
    camera: {
    flex: 1,
    position: 'absolute',
    zIndex:1,
    
     // 👈 necessary for absolutely-positioned children
  },
})