import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import RNBlobUtil from 'react-native-blob-util';

export const saveMultipleImagesToGallery = async (
  imagePaths: string[],
): Promise<string[]> => {
  const folderPath =
    Platform.OS === 'android'
      ? `${RNFS.PicturesDirectoryPath}/MyAppImages`
      : `${RNFS.DocumentDirectoryPath}/MyAppImages`;

  const exists = await RNFS.exists(folderPath);
  if (!exists) await RNFS.mkdir(folderPath);

  const savedPaths: string[] = [];

  for (let path of imagePaths) {
    const fileName = `IMG_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}.jpg`;
    const newPath = `${folderPath}/${fileName}`;
    await RNFS.copyFile(path, newPath);
    savedPaths.push(`file://${newPath}`);

    // Trigger gallery scan (Android only)
    if (Platform.OS === 'android') {
      await RNBlobUtil.fs.scanFile([{path: newPath, mime: 'image/jpeg'}]);
    }
  }

  return savedPaths;
};
