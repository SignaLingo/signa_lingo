import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text, TextInput } from 'react-native';
import { Audio, Recording, ResizeMode, Video } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getVideoFromText } from './lib/callAPI';
// import { client } from '@gradio/client'

export default function App() {
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [lastRec, setLastRec] = useState<Recording.SoundObject>();

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        const { recording: newRecording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        setRecording(newRecording);
      }
    } catch (err) {}
  }

  async function stopRecording() {
    if (recording) {
      await recording.stopAndUnloadAsync();
      setLastRec(await recording.createNewLoadedSoundAsync());
      setRecording(undefined);
    }
  }

  function displayMainContent() {
    if (recording) {
      return (
        <Text style={styles.text}>
          Écoute...
        </Text>
      );
    }
    else if (lastRec) {
      return (
        <img style={styles.sl} src="slPlaceholder.png"/>
      );
    }
    else {
      return (
        <Text style={styles.text}>
          Appuyer pour commencer
        </Text>
      );
    }
  }

  function todo() {
    
  }

  const [videoURL, setVideoURL] = useState<string | null>()
  const video = React.useRef(null);	
  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
    	<Video
			style={styles.video}
			ref={video}
			useNativeControls
			source={{
				uri: videoURL as string
			}}
			resizeMode={ResizeMode.CONTAIN}
			videoStyle={{'position': 'relative'}}
		/>
      </View>
      <View style={styles.bottomContainer}>
        <Pressable style={[styles.pressable, { backgroundColor: recording ? '#ff3333' : '#444950' }]} onPress={recording ? stopRecording : startRecording}>
          <Icon name="microphone" style={styles.icon} />
        </Pressable>
		<TextInput 
			style={styles.input}
			onChangeText={text => {
				getVideoFromText(text).then(url => setVideoURL(url))
			}}
		/>
        <Pressable style={[styles.pressable, { backgroundColor: '#444950'}]} onPress={todo()}>
          <Icon name="upload" style={styles.icon} />
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
  	backgroundColor: 'white'
  },
  video: {
	backgroundColor: 'white',
	alignSelf: 'center',
	width: 320,
	height: 320
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
  }
});
