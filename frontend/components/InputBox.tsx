import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Platform} from 'react-native'
import Language from './Language';
import AudioRecorder from './AudioTranscription';

interface InputBoxProps {
  onInputFinish: (input: string) => void;
}

const InputBox = (props: InputBoxProps) => {
  const webStyle = Platform.OS === 'web' ? { outline: 'none' } : {};
  const [currentInputText, setCurrentInputText] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');

  function handleTextChange(text: string) {
    setCurrentInputText(text);
  }
  
  function handleRecordingStart() {
    console.log('starting a new recording session')
    setCurrentInputText('')
  }

  function handleRecordingFinish() {
    console.log('ending a recording session')
    props.onInputFinish(currentInputText);
  }

  function handleNewTranscribedChunk(chunk: string) {
    console.log(chunk) 
    setCurrentInputText(chunk);
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputLanguageSelection}>
        <Language
          flag="🇫🇷"
          selected={selectedLanguage === 'fr'}
          onSelect={() => setSelectedLanguage('fr')}
          disabled={false}
        />
        <Language
          flag="🇺🇸"
          selected={selectedLanguage === 'en'}
          onSelect={() => setSelectedLanguage('en')}
          disabled={false}
        />
        <Language
          flag="🇩🇪"
          selected={selectedLanguage === 'de'}
          onSelect={() => setSelectedLanguage('de')}
          disabled={true}
        />
      </View>
      <TextInput
        maxLength={400}
        //@ts-expect-error
        style={[styles.textInput, webStyle]}
        multiline={true}
        value={currentInputText}
        onChangeText={handleTextChange}
      />
      <View style={styles.bottomContainer}>
        <View style={{marginLeft: 20}}>
          <AudioRecorder
            languageCode={selectedLanguage}
            onNewTranscribeChunk={handleNewTranscribedChunk}
            onRecordingEnd={handleRecordingFinish}
            onRecordingStart={handleRecordingStart}
            />
        </View>
      </View>
    </View>
  )
}

const styles =  StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
      flex: 1,
      alignItems: 'flex-start',
      backgroundColor: '#252525',
      borderColor: '#252525',
      fontSize: 32,
      color: '#DFDFDF',
      padding: 20,
      textAlignVertical: 'top',
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
    backgroundColor: '#252525'
  }
})

export default InputBox;

