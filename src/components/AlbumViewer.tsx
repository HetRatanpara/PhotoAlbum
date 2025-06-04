// src/components/AlbumViewer.tsx
import React from 'react';
import {View, Dimensions, StyleSheet, FlatList, ViewToken} from 'react-native';
import PhotoGrid from './PhotoGrid';

interface AlbumViewerProps {
  imageURIs: string[]; // array of file:// URIs
  photosPerPage: number; // e.g., 1, 2, 4, 6
}

/**
 * AlbumViewer: Splits imageURIs into pages based on photosPerPage,
 * then uses a horizontal FlatList with pagingEnabled for a “book-like” swipe.
 * Each page is rendered as a PhotoGrid with the appropriate numColumns.
 */
const AlbumViewer: React.FC<AlbumViewerProps> = ({
  imageURIs,
  photosPerPage,
}) => {
  // Split images into pages
  const pages: string[][] = [];
  for (let i = 0; i < imageURIs.length; i += photosPerPage) {
    pages.push(imageURIs.slice(i, i + photosPerPage));
  }

  const screenWidth = Dimensions.get('window').width;

  // Decide numColumns per page:
  let baseColumns = 1;
  if (photosPerPage === 1) baseColumns = 1;
  else if (photosPerPage === 2) baseColumns = 2;
  else if (photosPerPage === 4) baseColumns = 2;
  else if (photosPerPage === 6) baseColumns = 3;

  const renderPage = ({item: pageImages}: {item: string[]}) => {
    return (
      <View style={[styles.pageContainer, {width: screenWidth}]}>
        <PhotoGrid
          uris={pageImages}
          numColumns={baseColumns}
          containerWidth={screenWidth * 0.9}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={pages}
      keyExtractor={(_, idx) => `page-${idx}`}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={renderPage}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pageContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AlbumViewer;
