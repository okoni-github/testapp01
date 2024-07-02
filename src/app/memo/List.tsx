import React from 'react';
import { View, StyleSheet } from "react-native";
import { router, useNavigation } from 'expo-router';
import { useEffect } from 'react';

import MemoListItem from '../../components/MemoListItem';
import CircleButton from '../../components/circleButton';
import Icon from '../../components/icon'
import LogOutButton from '../../components/LogOutButton';

const handlePress = (): void => {
  router.push('/memo/create')
}

const List = ():JSX.Element => {
  // use〇〇はReactコンポーネントの直下に置く
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <LogOutButton /> }
    })
  }, [])

  return(
    <View style={styles.container}>
      <View>
        <MemoListItem />
        <MemoListItem />
        <MemoListItem />
      </View>
      <CircleButton onPress={handlePress}>
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