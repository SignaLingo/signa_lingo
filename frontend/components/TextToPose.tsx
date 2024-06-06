import { View, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import InputBox from './InputBox';
import { AntDesign } from '@expo/vector-icons';
import PoseView from './PoseView';

const TextToPose = () => {
  const [toTranslate, setToTranslate] = useState<string | undefined>(undefined);
  const [languageCode, setLanguageCode] = useState<string>('fr');
  const [signLanguageCode, setSignLanguageCode] = useState<string>('fsl');
  const [flexDirection, setFlexDirection] = useState<'row' | 'column'>('row');
  const [rotationSpacer, setRotationSpacer] = useState<{ transform: [{ rotate: string }] }>()

  const languageSignLanguageMap : Record<string, string> = {
    'fr': 'fsl',
    'en': 'ase',
  };

  useEffect(() => {
	const updateLayout = () => {
		const width = Dimensions.get('window').width;
		setFlexDirection(width > 500 ? 'row' : 'column');
		setRotationSpacer(width > 500 ? { transform: [{ rotate: '0deg' }] } : { transform: [{ rotate: '90deg' }] });
	};
	Dimensions.addEventListener('change', updateLayout);
	updateLayout();
	}, []);


  function handleFinishInput(input: string) {
    if (!input) {
      setToTranslate(undefined);
    } else {
      setToTranslate(input);
    }
  }

  function handleLanguageCodeChange(newlLanguageCode: string) {
    console.log("updating sign language code")
    console.log("updating language code")
    setLanguageCode(newlLanguageCode);
    setSignLanguageCode(languageSignLanguageMap[newlLanguageCode]);
  }

  return (
    <View style={[styles.translate, { flexDirection: flexDirection }]}>
      <View style={styles.box}>
        <InputBox onInputFinish={handleFinishInput} onLanguageCodeChange={handleLanguageCodeChange}/>
      </View>
      <View style={[styles.spacer, rotationSpacer ]}>
        <AntDesign name="swap" size={32} color="#DFDFDF"></AntDesign>
      </View>
      <View style={styles.box}>
        <PoseView 
          toTranslate={toTranslate}
          signLanguageCode={signLanguageCode}
          languageCode={languageCode}/>
      </View>
    </View>
  );
};

// let screen_width = Dimensions.get('window').width;
// let box_size = screen_width * 0.25;

const styles = StyleSheet.create({
  translate: {
    width: '100%',
    height: 'auto',
    justifyContent: 'center',
    marginTop: 60,
  },
  box: {
    width: 'auto',
    height: 'auto',
    borderRadius: 10,
    overflow: 'hidden',
  },
  spacer: {
    width: 'auto',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TextToPose;

