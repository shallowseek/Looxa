import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid';

const PHOTOS_DIR = FileSystem.documentDirectory + 'photos/';
const META_DIR = FileSystem.documentDirectory + 'meta/';

export const captureImage = async (cameraRef,) => {
  try {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true }).catch(() => {});
    await FileSystem.makeDirectoryAsync(META_DIR, { intermediates: true }).catch(() => {});
    console.log("this is the photo directory",PHOTOS_DIR)

    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({
        flash: 'on',
      });

      const sourcePath = photo?.path || photo?.filePath;

      if (sourcePath) {
        const id = uuid.v4();
        const photoPath = `${PHOTOS_DIR}${id}.jpg`;
        const metaPath = `${META_DIR}${id}.json`;
        const fileUri = `file://${photo.path}`; // ✅ Add file:// scheme
        // 🔥 Workaround: read the image as base64 and write it to expo's internal fs
        const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
//         Expo’s FileSystem.readAsStringAsync() only supports URIs with file:// prefix, like:

// ts
// Copy
// Edit
// file:///data/user/0/com.appname/files/...
// But VisionCamera returns a raw native path (without URI scheme):

// ts
// Copy
// Edit
// /data/user/0/com.appname/cache/mrousavy123.jpg ❌ ← Not supported
        await FileSystem.writeAsStringAsync(photoPath, base64, { encoding: FileSystem.EncodingType.Base64 });

        await FileSystem.writeAsStringAsync(metaPath, JSON.stringify({ hex: "#FFF000" }));

        console.log("✅ Photo and hex saved successfully");
        return true
      }
    }
  } catch (error) {
    console.error("❌ Error capturing image:", error);
  }
};
