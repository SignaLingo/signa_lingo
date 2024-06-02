import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { getGifFromText } from '../lib/callAPI';

interface PoseViewProps {
  toTranslate: string | undefined;
  languageCode: string;
  signLanguageCode: string;
}

function PoseView(props: PoseViewProps) {
  const [gifUrl, setGifUrl] = useState<string | undefined>(undefined);
  const [fetchError, setFetchError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const fullCode: Record<string, string> = {
    'fsl': 'French sign language',
    'asl': 'American sign language',
  }

  useEffect(() => {
    const fetchGif = async () => {
      if (props.toTranslate) {
        setLoading(true);
        try {
          const url = await getGifFromText(props.toTranslate, props.languageCode, props.signLanguageCode);
          setGifUrl(url);
          setFetchError('');
        } catch (error) {
          console.error('Error fetching GIF:', error);
          const message = error instanceof Error ? error.message : 'Unknown error occurred';
          setFetchError(message || 'Failed to fetch GIF');
          setGifUrl('');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setGifUrl('');
      }
    };

    fetchGif();
  }, [props.toTranslate]);

  return (
    <View style={styles.container}>
      <View style={styles.viewerHeader}>
        <Text style={styles.emojiText}>🧏 {fullCode[props.signLanguageCode]} translation</Text>
      </View>
      <View style={styles.imageContainer}>
        {loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : gifUrl ? (
          <Image source={{ uri: gifUrl }} style={styles.image} />
        ) : (
          fetchError && <Text style={styles.errorText}>{fetchError}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "#DFDFDF",
    fontSize: 38,
  },
  container: {
    flex: 1,
  },
  emojiText: {
    fontSize: 18,
    color: '#E5E5E5',
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

export default PoseView;
