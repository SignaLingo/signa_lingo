import React, { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { getGifFromText } from '../lib/callAPI';

interface TextToPoseProps {
  toTranslate: string | undefined;
}

const TextToPose = (props: TextToPoseProps) => {
  const [gifUrl, setGifUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGif = async () => {
      if (props.toTranslate) {
        setLoading(true);  // Ensure this runs
        try {
          const url = await getGifFromText(props.toTranslate, 'fr', 'fsl');
          setGifUrl(url);
        } catch (error) {
          console.error('Error fetching GIF:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setGifUrl(undefined);
      }
    };
    fetchGif();
  }, [props.toTranslate]);

  return (
    <View style={styles.container}>
      <View style={styles.viewerHeader}>
        <Text style={styles.emojiText}>🧏 Sign language translation</Text>
      </View>
      <View style={styles.imageContainer}>
        {loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          gifUrl && <Image source={{ uri: gifUrl }} style={styles.image} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emojiText: {
    fontSize: 18,
    color: '#E5E5E5'
  },
  viewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#1a1a1a',
    backgroundColor: '#252525',
    height: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#252525',
    aspectRatio: 1,
  },
  loader: {
    flex: 1,
    color: '#20232a',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default TextToPose;