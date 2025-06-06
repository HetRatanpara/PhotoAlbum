import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import RNBlobUtil from 'react-native-blob-util';

/**
 * Ensure that the directory at `path` exists. If not, create it.
 */
export async function ensureDir(path: string) {
  const exists = await RNFS.exists(path);
  if (!exists) {
    await RNFS.mkdir(path);
  }
}

/**
 * Copy a file from `sourcePath` (picker temp path) to `destPath` (within app directories).
 * Returns the new file URI (`file://…`).
 * On Android, triggers a media scan so the image appears in the Gallery.
 */
export async function copyFileTo(
  sourcePath: string,
  destPath: string,
): Promise<string> {
  await RNFS.copyFile(sourcePath, destPath);

  if (Platform.OS === 'android') {
    // Trigger Gallery scan
    await RNBlobUtil.fs.scanFile([{path: destPath, mime: 'image/jpeg'}]);
  }

  return 'file://' + destPath;
}
