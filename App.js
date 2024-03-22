import React from 'react';
import { StyleSheet, View, Button, Pressable} from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';
import { client } from "https://cdn.jsdelivr.net/npm/@gradio/client@0.6.0/dist/index.min.js";

export default function App() {
  const [recording, setRecording] = React.useState();

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        setRecording(recording);
      }
    } catch (err) {}
  }

  async function stopRecording() {
    setRecording(undefined);
  }

  return (
    <View style={styles.container}>
      <Pressable style={[styles.pressable, { backgroundColor: recording ? '#ff3333' : '#444950' }]}  onPress={recording ? stopRecording : startRecording}>
        <Icon name="microphone" style={styles.icon} />
      </Pressable>
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
  pressable: {
    borderRadius: 40,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: 'white',
    fontSize: 30,
  }
});
