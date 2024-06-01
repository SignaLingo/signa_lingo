import React, {  } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Header from './components/Header';
import TextToPose from './components/TextToPose';

export default function App() {
  return (
    <View style={styles.main}>
      <Header></Header>
      <View style={styles.container}>
        <TextToPose></TextToPose>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#1a1a1a",
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: Dimensions.get('window').width * 0.6,
    width: '100%',
    backgroundColor: '#1a1a1a',
  },
});
