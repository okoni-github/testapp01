import React from 'react';
import {  View,StyleSheet } from "react-native";

import Header from '../components/Haeder';
import MemoListItem from '../components/MemoListItem';
import CircleButton from '../components/circleButton';

const Index = ():JSX.Element => {
  return(
    <View style={styles.container}>
    < Header />
      <View>
        <MemoListItem />
        <MemoListItem />
        <MemoListItem />
      </View>
      <CircleButton>+</CircleButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1, //画面いっぱいに要素を広げる
    backgroundColor: '#ffffff',
  },
})

export default Index