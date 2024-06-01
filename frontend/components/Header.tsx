import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { imageAssets } from '../assets/imageAssets';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Image source={imageAssets.logo_full} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#252525',
    paddingHorizontal: 40,
  },
  logo: {
    width: 873 * 0.27,
    height: 215 * 0.27,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dfdfdf'
  },
});

export default Header;
