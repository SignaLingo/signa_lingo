import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Pressable, Dimensions, Text, Image, TextInput } from 'react-native';
import { callWhisper } from './lib/callAPI';
import { FontAwesome } from '@expo/vector-icons';
import { imageAssets } from './assets/imageAssets';
import GifViewer from './GifViewer';

export default function App() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [toTranslate, setToTranslate] = useState<string | undefined>(undefined);
  const [inputText, setInputText] = useState<string | undefined>(undefined);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const mediaRecorder = React.useRef<MediaRecorder | null>(null);
  const audioChunks = React.useRef<Blob[]>([]);

  const handleInputChange = (text: string) => {
    setInputText(text);
  };

  // doesn't start to actually translate if the user is actively typing
  // this is mainly for the typing, because whisper timout is far superior as 500ms
  useEffect(() => {
    // if the input text is reseted, reset the current translation
    if (!inputText) {
      setToTranslate(undefined);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      if (inputText !== toTranslate) {
        setToTranslate(inputText);
      }
    }, 500);

    // Cleanup function to clear the timeout if the component unmounts or inputText changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputText, toTranslate]);

  const startRecording = async () => {
    // reset input and current text
    setInputText('');
    setToTranslate('');
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
      callWhisper(audioBlob).then((text) => {
        setInputText(text);
      });
    };
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
      callWhisper(audioBlob).then((text) => {
        setInputText(text);
      });
      audioChunks.current = [];
    };
    mediaRecorder.current.start(1000);
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  return (
    <View style={styles.container}>
      <Image source={imageAssets.logo_full} style={styles.logo} />
      <View style={styles.videoContainer}>
        <GifViewer text={toTranslate}></GifViewer>
      </View>

      <View style={styles.entryContainer}>
        <Text style={styles.inputHeader}>Ecrire ou enregistrer pour commencer a traduire...</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.textInput} onChangeText={handleInputChange} value={inputText} />{' '}
          <Pressable onPress={isRecording ? stopRecording : startRecording}>
            <FontAwesome
              name={'microphone'}
              size={22}
              color={isRecording ? 'red' : isHovering ? '#B7B7B7' : '#959595'}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entryContainer: {
    justifyContent: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.3,
  },
  logo: {
    width: 873 * 0.5,
    height: 215 * 0.5,
    marginBottom: 40,
  },
  videoContainer: {
    alignSelf: 'center',
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').width * 0.3,
    aspectRatio: 1,
    marginBottom: 40,
    backgroundColor: '#1A1C22',
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: 'white',
    backgroundColor: '#1A1C22',
    padding: 10,
    height: Dimensions.get('window').width * 0.025,
    marginRight: 20,
  },
  inputHeader: {
    fontSize: 22,
    color: 'white',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#20232a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'system-ui,-apple-system,sans-serif',
    fontSize: 18,
  },
  input: {
    backgroundColor: 'white',
  },
  icon: {
    color: 'white',
    fontSize: 24,
  },
});
