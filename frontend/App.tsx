import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { callWhisper, getVideoFromText } from './lib/callAPI';

export default function App() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [videoURL, setVideoURL] = useState<string | null>();

  const mediaRecorder = React.useRef<MediaRecorder | null>(null);
  const audioChunks = React.useRef<Blob[]>([]);
  const video = React.useRef(null);

  const startRecording = async () => {
	setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
		callWhisper(audioBlob).then(text => getVideoFromText(text)).then(url => setVideoURL(url));
    };

    mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
		callWhisper(audioBlob).then(text => getVideoFromText(text)).then(url => setVideoURL(url));
        audioChunks.current = [];
    };
		mediaRecorder.current.start(1000)
        setIsRecording(true);
    };

	const stopRecording = () => {
        mediaRecorder.current?.stop();
        setIsRecording(false);
    };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Video
          style={styles.video}
          ref={video}
		shouldPlay
          useNativeControls
          source={{
            uri: videoURL!,
          }}
          resizeMode={ResizeMode.CONTAIN}
          videoStyle={{ position: 'relative' }}
        />
      </View>
      <View style={styles.bottomContainer}>
        <Pressable
          style={[styles.pressable, { backgroundColor: isRecording ? '#ff3333' : '#444950' }]}
          onPress={isRecording ? stopRecording : startRecording}
        >
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20232a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 8,
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 2,
  },
  text: {
    color: 'white',
    fontFamily: 'system-ui,-apple-system,sans-serif',
    fontSize: 18,
  },
  input: {
    backgroundColor: 'white',
  },
  video: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: 320,
    height: 320,
  },
  pressable: {
    borderRadius: 40,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  icon: {
    color: 'white',
    fontSize: 30,
  },
  sl: {
    width: '90%',
  },
});
