import React, { useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { callWhisper } from '../lib/callAPI';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AudioTranscriptionProps {
  onRecordingStart: () => void;
  onRecordingEnd: () => void;
  onNewTranscribeChunk: (chunk: string) => void;
  languageCode: string;
}

const AudioTranscription = (props: AudioTranscriptionProps) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const listenedTextRef = useRef('');

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const inactivityTimeout = useRef(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const startRecording = async () => {
    props.onRecordingStart();
    audioChunks.current = []; // reset previously stored audio chunk for new recording session
    listenedTextRef.current = '';
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
        processRecording();
      }
    };

    mediaRecorder.current.onstop = () => {
      audioChunks.current = [];
      stopRecording();
    };

    mediaRecorder.current.start(1000);
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    props.onRecordingEnd();
    setIsRecording(false);
    //@ts-expect-error
    clearTimeout(inactivityTimeout.current);
    listenedTextRef.current = '';
  };

  const processRecording = () => {
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
    callWhisper(audioBlob, props.languageCode).then((newText) => {
      console.log(`currently stored listend text: ${listenedTextRef.current}`);
      console.log(`new text comming from whisper: ${newText}`);
      if (newText.length > listenedTextRef.current.length) {
        console.log('adding new text to the listened one');
        listenedTextRef.current = newText;
        props.onNewTranscribeChunk(newText);
        resetInactivityTimeout();
      }
    });
  };

  const resetInactivityTimeout = () => {
    //@ts-expect-error
    clearTimeout(inactivityTimeout.current);
    //@ts-expect-error
    inactivityTimeout.current = setTimeout(() => {
      console.log('Stopping recording due to inactivity.');
      stopRecording();
    }, 2000);
  };

  return (
    <Pressable onPress={isRecording ? stopRecording : startRecording}>
      <MaterialCommunityIcons
        name={'microphone-outline'}
        size={32}
        color={isRecording ? 'red' : isHovering ? '#B7B7B7' : '#959595'}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </Pressable>
  );
};

export default AudioTranscription;
