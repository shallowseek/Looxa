import { Link } from "expo-router"
import React from "react"
import { Text } from "react-native"
import { Button, Dialog, Portal } from "react-native-paper"
import DialogActions from "react-native-paper/lib/typescript/components/Dialog/DialogActions"

interface PermissionPopupProps {
  visible: boolean
  onClose: () => void
  onUnderstand: () => void
}

const PermissionPopup = ({ visible, onClose, onUnderstand }: PermissionPopupProps) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose}>
        <Dialog.Title>Camera Permission Required</Dialog.Title>
        <Dialog.Content>
          <Text>
            To use the color detection feature, we need access to your camera. Please grant
            permission to continue.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>Cancel</Button>
          <Button onPress={onUnderstand}>Understand</Button>
        </Dialog.Actions>
      <Dialog.Actions>   
          
          <Link href={"/"}><Text style={{color:"blue", textDecorationColor:"underline"}}>For more information..</Text></Link>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default PermissionPopup
