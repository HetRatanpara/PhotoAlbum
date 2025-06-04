// src/components/PhotoGrid.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Dimensions,
  FlatList,
  ImageURISource,
  StyleSheet,
} from 'react-native';

interface PhotoGridProps {
  uris: string[]; // array of file:// URIs
  numColumns: number; // how many columns in the grid
  containerWidth?: number; // optional override width
}

interface ItemDimensions {
  width: number;
  height: number;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  uris,
  numColumns,
  containerWidth,
}) => {
  const [dimMap, setDimMap] = useState<Record<string, ItemDimensions>>({});

  const screenWidth = containerWidth ?? Dimensions.get('window').width - 20;
  const ITEM_MARGIN = 5;
  const totalMargin = ITEM_MARGIN * (numColumns + 1);
  const itemWidth = (screenWidth - totalMargin) / numColumns;

  useEffect(() => {
    uris.forEach(uri => {
      if (!dimMap[uri]) {
        Image.getSize(
          uri,
          (w, h) => {
            const ratio = h / w;
            const height = itemWidth * ratio;
            setDimMap(prev => ({
              ...prev,
              [uri]: {width: itemWidth, height},
            }));
          },
          err => {
            console.warn('Failed to getSize for', uri, err);
            setDimMap(prev => ({
              ...prev,
              [uri]: {width: itemWidth, height: itemWidth},
            }));
          },
        );
      }
    });
  }, [uris]);

  const renderItem = ({item}: {item: string}) => {
    const dims = dimMap[item] || {width: itemWidth, height: itemWidth};
    return (
      <View style={{margin: ITEM_MARGIN}}>
        <Image
          source={{uri: item} as ImageURISource}
          style={{width: dims.width, height: dims.height, borderRadius: 4}}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <FlatList
      data={uris}
      keyExtractor={item => item}
      numColumns={numColumns}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      // <-- allow vertical scrolling when the content is larger than container
      scrollEnabled={true}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
});

export default PhotoGrid;
