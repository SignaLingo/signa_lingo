import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Language from './Language';
import AudioRecorder from './AudioTranscription';
import InputField from './InputField';

interface InputBoxProps {
  onInputFinish: (input: string) => void;
  onLanguageCodeChange: (newCode: string) => void;
}

const InputBox = (props: InputBoxProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [lettersCount, setLettersCount] = useState(0);
  const recorderTextRef = useRef('');
  const textFieldTextRef = useRef('');

  function handleLanguageChange(newLanguageCode: string) {
    setSelectedLanguage(newLanguageCode);
    props.onLanguageCodeChange(newLanguageCode);
  }

  /*
   * Called when the child `AudioTranscriptor` start a new recording session
   */
  function handleRecordingStart() {
    console.log('starting a new recording session');
    recorderTextRef.current = '';
  }

  /*
   * Called when the child `AudioTranscriptor` start a new recording session
   */
  function handleRecordingFinish() {
    console.log('ending a recording session');
    props.onInputFinish(recorderTextRef.current);
  }

  /*
   * Called when the child `AudioTranscriptor` return
   * a new transcribed chunk.
   */
  function handleNewTranscribedChunk(chunk: string) {
    recorderTextRef.current = chunk;
    setLettersCount(chunk.length);
  }

  function handleTextFieldChange(text: string) {
    textFieldTextRef.current = text;
    setLettersCount(text.length);
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputLanguageSelection}>
        <Language
          flag="🇫🇷"
          selected={selectedLanguage === 'fr'}
          onSelect={() => handleLanguageChange('fr')}
          disabled={false}
        />
        <Language
          flag="🇺🇸"
          selected={selectedLanguage === 'en'}
          onSelect={() => handleLanguageChange('en')}
          disabled={false}
        />
        <Language
          flag="🇩🇪"
          selected={selectedLanguage === 'de'}
          onSelect={() => handleLanguageChange('de')}
          disabled={true}
        />
      </View>
      <InputField 
        onInputStart={() => {}}
        onInputEnd={() => {}}
        onTextFieldChange={handleTextFieldChange}
        externalValue={recorderTextRef.current}
      />
      <View style={styles.bottomContainer}>
        <View style={{ marginLeft: 20 }}>
          <AudioRecorder
            languageCode={selectedLanguage}
            onNewTranscribeChunk={handleNewTranscribedChunk}
            onRecordingEnd={handleRecordingFinish}
            onRecordingStart={handleRecordingStart}
          />
        </View>
        <View style={{ marginRight: 20 }}>
          <Text style={styles.lettersCount}>{lettersCount} / 400</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  lettersCount: {
    color: 'white',
    fontSize: 12,
  },
  container: {
    flex: 1,
  },
  inputLanguageSelection: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#1a1a1a',
    backgroundColor: '#252525',
    height: 40,
  },
  emojiText: {
    marginHorizontal: 10,
    fontSize: 28,
  },
  bottomContainer: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#252525',
  },
});

export default InputBox;
