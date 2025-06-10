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
 */
export async function saveNewAlbum(
  selectedPaths: string[],
  photosPerPage: number,
  albumName: string,
): Promise<AlbumMetadata> {
  try {
    const albumsRoot = getAlbumsRootPath();
    console.log('[AlbumStorage] albumsRoot =', albumsRoot);

    await ensureDir(albumsRoot);

    const albumId = uuid.v4();
    const albumFolder = `${albumsRoot}/${albumId}`;
    console.log('[AlbumStorage] Creating album folder:', albumFolder);
    await ensureDir(albumFolder);

    const savedURIs: string[] = [];
    for (let i = 0; i < selectedPaths.length; i++) {
      const original = selectedPaths[i];
      const filename = `IMG_${Date.now()}_${i}.jpg`;
      const destPath = `${albumFolder}/${filename}`;
      console.log(`[AlbumStorage] Copying from ${original} to ${destPath}`);
      const fileUri = await copyFileTo(original, destPath);
      savedURIs.push(fileUri);
    }

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
    Alert.alert(
      'Save Album Error',
      `Could not save album: ${error.message || error}`,
    );
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

/**
 * ✅ Load all album metadata from Albums directory
 */
export async function loadAllAlbums(): Promise<AlbumMetadata[]> {
  const albumsRoot = getAlbumsRootPath();
  try {
    const folders = await RNFS.readDir(albumsRoot);
    const albumFolders = folders.filter(entry => entry.isDirectory());

    const albums: AlbumMetadata[] = [];

    for (const folder of albumFolders) {
      try {
        const metaPath = `${folder.path}/album.json`;
        const content = await RNFS.readFile(metaPath, 'utf8');
        const metadata: AlbumMetadata = JSON.parse(content);
        albums.push(metadata);
      } catch (e) {
        console.warn(
          '[AlbumStorage] Skipping folder with missing/invalid metadata:',
          folder.name,
        );
      }
    }

    return albums;
  } catch (err) {
    console.error('[AlbumStorage] Error loading all albums:', err);
    return [];
  }
}

export async function deleteAlbumById(albumId: string): Promise<void> {
  const albumFolder = `${getAlbumsRootPath()}/${albumId}`;
  const exists = await RNFS.exists(albumFolder);
  if (exists) {
    await RNFS.unlink(albumFolder);
  }
}
