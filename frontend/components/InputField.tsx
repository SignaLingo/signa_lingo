import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, Platform } from 'react-native';

interface InputFieldProps {
  onInputStart: () => void;
  onTextFieldChange: (text: string) => void;
  onInputEnd: () => void;
  externalValue: string;
}

const InputField = (props: InputFieldProps) => {
  const [inputText, setInputText] = useState('');
  const webStyle = Platform.OS === 'web' ? { outline: 'none' } : {};

  function handleTextChange(text: string) {
    setInputText(text);
    props.onTextFieldChange(text);
  }

  // TODO text field timout
  const inactivityTimeout = useRef(null);

  useEffect(() => {
    // if the audio recorder provide some text
    // reflect it on the input
    // the callback is not called because
    // this is the concern of the audio recorder
    if (props.externalValue && props.externalValue !== inputText) {
      setInputText(props.externalValue);
    }
  }, [props.externalValue])

  return (
    <TextInput
      maxLength={400}
      //@ts-expect-error
      style={[styles.textField, webStyle]}
      multiline={true}
      value={inputText}
      onChangeText={handleTextChange}
    />
  );
};

export default InputField;

const styles = StyleSheet.create({
  textField: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: '#252525',
    borderColor: '#252525',
    fontSize: 32,
    color: '#DFDFDF',
    padding: 20,
    textAlignVertical: 'top',
  },
});
