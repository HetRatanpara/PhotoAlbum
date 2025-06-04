import React, {useState} from 'react';
import {View, ScrollView, Image, StyleSheet} from 'react-native';
import ImagePickerButton from '../components/ImagePickerButton';

const HomeScreen = () => {
  const [imageUris, setImageUris] = useState<string[]>([]);

  return (
    <View style={styles.container}>
      <ImagePickerButton onImagesSelected={setImageUris} />
      <ScrollView contentContainerStyle={styles.imageGrid}>
        {imageUris.map((uri, index) => (
          <Image key={index} source={{uri}} style={styles.image} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});

export default HomeScreen;
