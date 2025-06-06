import RNFS from 'react-native-fs';
import {copyFileTo, ensureDir} from './FileUtils';
import uuid from 'react-native-uuid';
import {Platform, Alert} from 'react-native';

export interface AlbumMetadata {
  id: string;
  name: string;
  photosPerPage: number;
  images: string[]; // array of file:// URIs
}

/**
 * Root path where all albums are stored: DocumentDirectoryPath/Albums
 */
export function getAlbumsRootPath(): string {
  return RNFS.DocumentDirectoryPath + '/Albums';
}

/**
 * Save a new album:
 *  - Create unique folder under Albums/<albumId>
 *  - Copy each selected image into that folder
 *  - Write album.json metadata inside the folder
 *
 * selectedPaths: array of picker temp paths (e.g., '/…/Cache/IMG_12345.jpg')
 * photosPerPage: number of photos per page (1/2/4/6)
 * albumName: user-defined album name
 */
export async function saveNewAlbum(
  selectedPaths: string[],
  photosPerPage: number,
  albumName: string,
): Promise<AlbumMetadata> {
  try {
    const albumsRoot = getAlbumsRootPath();
    console.log('[AlbumStorage] albumsRoot =', albumsRoot);

    // 1) Ensure Albums root exists
    await ensureDir(albumsRoot);

    // 2) Create a unique album ID & folder
    const albumId = uuid.v4();
    const albumFolder = `${albumsRoot}/${albumId}`;
    console.log('[AlbumStorage] Creating album folder:', albumFolder);

    await ensureDir(albumFolder);

    // 3) Copy each selected image into albumFolder
    const savedURIs: string[] = [];
    for (let i = 0; i < selectedPaths.length; i++) {
      const original = selectedPaths[i];
      const filename = `IMG_${Date.now()}_${i}.jpg`;
      const destPath = `${albumFolder}/${filename}`;
      console.log(`[AlbumStorage] Copying from ${original} to ${destPath}`);
      const fileUri = await copyFileTo(original, destPath);
      savedURIs.push(fileUri);
    }

    // 4) Write the metadata JSON
    const metadata: AlbumMetadata = {
      id: albumId,
      name: albumName,
      photosPerPage,
      images: savedURIs,
    };
    const metaJSON = JSON.stringify(metadata, null, 2);
    const metaPath = `${albumFolder}/album.json`;
    console.log('[AlbumStorage] Writing metadata to:', metaPath);
    await RNFS.writeFile(metaPath, metaJSON, 'utf8');

    console.log('[AlbumStorage] Album saved successfully:', metadata);
    return metadata;
  } catch (error: any) {
    console.error('[AlbumStorage] Failed to save album:', error);
    // Optionally show an alert so the user sees the reason:
    Alert.alert(
      'Save Album Error',
      `Could not save album: ${error.message || error}`,
    );
    // Rethrow so the caller knows it failed
    throw error;
  }
}

/**
 * Load an existing album’s metadata (AlbumMetadata) from Albums/<albumId>/album.json
 */
export async function loadAlbum(albumId: string): Promise<AlbumMetadata> {
  const metaPath = `${getAlbumsRootPath()}/${albumId}/album.json`;
  const content = await RNFS.readFile(metaPath, 'utf8');
  const metadata: AlbumMetadata = JSON.parse(content);
  return metadata;
}
