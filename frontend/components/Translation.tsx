import { View, StyleSheet, Dimensions} from "react-native"
import React, { useState } from 'react'
import InputBox from "./InputBox";
import { AntDesign } from "@expo/vector-icons";
import TextToPose from "./TextToPose";

const Translation = () => {
  const [toTranslate, setToTranslate] = useState<string | undefined>(undefined);

  function handleInput(input: string) {
    console.log("handling input from the translation component");
    console.log(input);
    if (!input) {
      setToTranslate(undefined)
    } else {
      setToTranslate(input);
    }
  }

  return (
    <View style={styles.translate}>
      <View style={styles.box}>
        <InputBox onInputFinish={handleInput}/>
      </View>
      <View style={styles.spacer}>
      <AntDesign name='swap' size={32} color='#DFDFDF'></AntDesign> 
      </View>
      <View style={styles.box}>
        <TextToPose toTranslate={toTranslate}/>
      </View>
    </View>
  )
}

let screen_width = Dimensions.get('window').width;
let box_size = screen_width * 0.25;

const styles = StyleSheet.create({
  translate: {
    width: '100%',
    height: box_size,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 60
  },
  box: {
      width: box_size,
      height: box_size,
      borderRadius: 10,
      overflow: 'hidden',
  },
  spacer: {
    width: '5%',
    height: box_size,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Translation;