import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Camera } from 'react-native-vision-camera'
// import { Camera as C} from 'expo-camera';//fot flashlight

// type props:{
//   device:Camera.,

// }




const CameraPreview = ({device, cameraRef, frameProcessor}) => {


  return (
    <>

      <Camera
        style={[StyleSheet.absoluteFill]}
        isActive={true}
        // torch={flash === 'on' ? 'on' : 'off'}
        // resizeMode={display} // better than 'contain' for full-screen
        //giving option to user to set mode//
        ref={cameraRef}
        photo={true}
        device={device}
        exposure={0}
        frameProcessor={frameProcessor}
        //  animatedProps={animatedProps}
        // format={formats}
        // fps={fps}
        enableZoomGesture={true}
        // zoom={}
        pointerEvents='box-only'
        onLayout={(e)=>{const{height, width}=e.nativeEvent.layout
    console.log("this is the height",height,"width",width)}}
      />
      
      {/* ✅ render overlay children ABOVE the camera */}
      {/* {children} */}

    </>
  )
}

export default CameraPreview

const styles = StyleSheet.create({
    camera: {
    flex: 1,
    // position: 'absolute',
    // zIndex:0,
    
     // 👈 necessary for absolutely-positioned children
  },
})