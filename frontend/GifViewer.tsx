import React, { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { getGifFromText } from './lib/callAPI';

interface GifViewerProps {
  text: string;
}

const GifViewer = (props: GifViewerProps) => {
  const [gifUrl, setGifUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGif = async () => {
      setLoading(true);
      try {
        const url = await getGifFromText(props.text, 'fr', 'fsl');
        setGifUrl(url);
      } catch (error) {
        console.error('Error fetching GIF:', error);
      } finally {
        setLoading(false);
      }
    };

    if (props.text) {
      fetchGif();
    } else {
      setLoading(false);
      setGifUrl(undefined);
    }
  }, [props.text]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        gifUrl && <Image source={{ uri: gifUrl }} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1C22',
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

export default GifViewer;
