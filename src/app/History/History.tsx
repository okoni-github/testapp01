import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useNavigation } from 'expo-router';
import Footer from '../Footer';
import LogOutButton from '@/src/components/LogOutButton';
import AccountButton from '@/src/components/AccountButton';

const History = ():JSX.Element => {

  const navigation = useNavigation()
  // 画面表示の際に一度だけログアウトボタンを表示する
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <LogOutButton /> },
      headerLeft: () => { return <AccountButton /> }
    })
  }, [])

    return(
        <View style={styles.container}>
            <Text>履歴画面</Text>
            <Footer />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex:1, //画面いっぱいに要素を広げる
    backgroundColor: '#ffffff',
  },
})

export default History