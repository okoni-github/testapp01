import React from 'react';
import { View, StyleSheet, FlatList } from "react-native";
import { router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';



import MemoListItem from '../../components/MemoListItem';
import CircleButton from '../../components/circleButton';
import Icon from '../../components/icon'
import LogOutButton from '../../components/LogOutButton';
import AccountButton from '../../components/AccountButton';
import { db, auth } from '../../config'
import { type Memo } from '../../../types/memo'

const handlePress = (): void => {
  router.push('/memo/create')
}


const List = ():JSX.Element => {

  const  [memos, setMemos] = useState<Memo[]>([])
  // use〇〇はReactコンポーネントの直下に置く
  const navigation = useNavigation()
  // 画面表示の際に一度だけログアウトボタンを表示する
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <LogOutButton /> },
      headerLeft: () => { return <AccountButton /> }
    })
  }, [])

  // メモのデータを画面が消える時以外監視する
  useEffect(() => {
    if(auth.currentUser === null) { return }
    const ref = collection(db, `users/${auth.currentUser.uid}/memos`)
    // データの条件(フィルターや並び順)
    const q = query(ref, orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const remoteMemos: Memo[] = []
      snapshot.forEach((doc) => {
        const { bodyText, updatedAt } = doc.data()
        remoteMemos.push({
          id: doc.id,
          bodyText,
          updatedAt
        })
      })
      setMemos(remoteMemos)
    })
    return unsubscribe
  },[])

  return(
    <View style={styles.container}>
      <FlatList
        data={memos}
        renderItem={({ item }) => <MemoListItem memo={item} /> }
      />
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