import React from 'react';
import { View,StyleSheet } from "react-native";

import Header from '@/src/components/Haeder';
import MemoListItem from '@/src/components/MemoListItem';
import CircleButton from '@/src/components/circleButton';
import Icon from '../../components/icon'

const List = ():JSX.Element => {
  return(
    <View style={styles.container}>
    < Header />
      <View>
        <MemoListItem />
        <MemoListItem />
        <MemoListItem />
      </View>
      <CircleButton>
        <Icon name='plus' size={40} color='#ffffff' />
      </CircleButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1, //画面いっぱいに要素を広げる
    backgroundColor: '#ffffff',
  },
})

export default List