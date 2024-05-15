import React, { useState } from 'react';
import { Alert, StyleSheet, View, Pressable, Text, TextInput } from 'react-native';
import { Audio, ResizeMode, Video } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';
import { callWhisper, getVideoFromText } from './lib/callAPI';
import * as DocumentPicker from 'expo-document-picker';
import { client } from '@gradio/client';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [lastRec, setLastRec] = useState<any>();
  const [audioFile, setAudioFile] = useState({ name: '', data: '' });
  const [dataOutput, setDataOutput] = useState('Data');
  const [statusOutput, setStatusOutput] = useState('Status');
<<<<<<< HEAD
  const spaceName = 'tlemagny/signalingo_whisper';
  const readingToken = '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';
  const writingToken = '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';
=======
>>>>>>> 724c438 (commit before crash)
  const [isTranscribing, setIsTranscribing] = useState(false);

  const blobToBase64 = async (blob): Promise<string> => {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  };

  async function transcribe() {
    if (!audioFile.name) {
      Alert.alert('No file given', 'No audio file given as input.', [{ text: 'OK' }]);
      console.log('No audio file given as input.');
      return;
    }
    if (isTranscribing) {
      Alert.alert('Transcription in Progress', 'Transcription is already in progress. Please wait.', [{ text: 'OK' }]);
      console.log('Transcription is already in progress. Please wait.');
      return;
    }
<<<<<<< HEAD
    setDataOutput('Data : Transcribing your file ...');
    // const app = await client(spaceName, {hf_token : readingToken});
    // const app = await client("openai/whisper");
    const app = await client('hf-audio/whisper-large-v3', {});
    await updateHardware(writingToken, spaceName, 'cpu-basic');
    const submission = app.submit('/predict_1', [audioFile, 'transcribe']);
    setIsTranscribing(true);
    submission.on('data', (data) => {
      console.log(data);
      setDataOutput(data.data[0] as string);
      setIsTranscribing(false);
      getVideoFromText(data.data[0] as string).then((url) => {
        setVideoURL(url);
      });
      updateHardware(writingToken, spaceName, 'cpu-basic');
    });
    submission.on('status', (status) => {
      console.log(status);
      setStatusOutput(`Status: ${status.stage}, Queue Position: ${status.position}, Queue Size: ${status.size}`);
    });
  }

  async function updateHardware(hfToken: string, spaceName: string, hardwareFlavor: string, sleepTimeSeconds = 3600) {
    const url = `https://huggingface.co/api/spaces/${spaceName}/hardware`;
    const headers = {
      Authorization: `Bearer ${hfToken}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
      flavor: hardwareFlavor,
      sleepTimeSeconds,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Hardware update response:', data);
    return data;
  }

=======
    setDataOutput("Data : Transcribing your file ...");
    setIsTranscribing(true);
		callWhisper(audioFile.data).then((text: string) => {
			console.log(text)
			setDataOutput(text)
			setIsTranscribing(false)
			getVideoFromText(text).then(url => setVideoURL(url))
		})
  }

>>>>>>> 724c438 (commit before crash)
  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(newRecording);
      }
    } catch (err) {}
  }

  async function uriToBase64(uri: string): Promise<string> {
    try {
      // Use fetch to get the response as a blob
      const response = await fetch(uri);
      if (!response.ok) {
        throw new TypeError('Network request failed');
      }
      const blob = await response.blob();

      // Convert blob to Base64
      return await blobToBase64(blob);
    } catch (error) {
      console.error('Error converting URI to Base64:', error);
      throw error; // Re-throw to handle this error further up in your application
    }
  }

  async function stopRecording() {
    if (recording) {
      await recording.stopAndUnloadAsync();
      setLastRec(await recording.createNewLoadedSoundAsync());
      const audioURI = recording.getURI();
      const audioBase64 = await uriToBase64(audioURI!);
      setAudioFile({
        name: 'http://localhost:8081/audio',
        data: audioBase64.split(',')[1],
      });
      setRecording(undefined);
    }
  }

  async function pickDocument() {
    const result = await DocumentPicker.getDocumentAsync({});
    const file = result.assets?.[0]!;
    setAudioFile({
      name: file.name,
      data: file.uri.split(',')[1],
    });
  }

  function displayMainContent() {
    if (recording) {
      return <Text style={styles.text}>Écoute...</Text>;
    } else if (lastRec) {
      return <img style={styles.sl} src="./assets/slPlaceholder.png" />;
    } else {
      return <Text style={styles.text}>Appuyer pour commencer</Text>;
    }
  }

  const [videoURL, setVideoURL] = useState<string | null>();
  const video = React.useRef(null);
  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Video
          style={styles.video}
          ref={video}
          useNativeControls
          source={{
            uri: videoURL!,
          }}
          resizeMode={ResizeMode.CONTAIN}
          videoStyle={{ position: 'relative' }}
        />
        <Text style={styles.text}>Status: {statusOutput}</Text>
        <Text style={styles.text}>Data: {dataOutput}</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Pressable
          style={[styles.pressable, { backgroundColor: recording ? '#ff3333' : '#444950' }]}
          onPress={recording ? stopRecording : startRecording}
        >
          <Icon name="microphone" style={styles.icon} />
        </Pressable>
        <Pressable style={[styles.pressable, { backgroundColor: '#444950' }]} onPress={transcribe}>
          <MaterialIcons name="transcribe" style={styles.icon} />
        </Pressable>
        <Pressable style={[styles.pressable, { backgroundColor: '#444950' }]} onPress={pickDocument}>
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
