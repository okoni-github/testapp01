import React from 'react';
import { TouchableOpacity, Text,
        Alert, StyleSheet,  } from 'react-native';
import { signOut } from 'firebase/auth'
import { router } from 'expo-router';

import { auth } from '../config';

const handlePress = (): void => {

    Alert.alert('ログアウトします', 'よろしいですか？', [
    {
        text: 'キャンセル'
    },
    {
        text: 'ログアウトする',
        // 赤文字で表示する ※iosのみ
        style: 'destructive',
        // ログアウトするを選択した場合にログアウト処理を実行する
        onPress: () => {
            // サインアウト
            signOut(auth)
                .then(() => {
                    router.replace('/auth/log_in')
                })
                .catch(() => {
                    Alert.alert("ログアウトが失敗しました")
                })
        }
    }
])

}

const LogOutButton = (): JSX.Element => {
    return(
        <TouchableOpacity onPress={handlePress}>
            <Text style={styles.text}>ログアウト</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 12,
        lineHeight: 24,
        color: 'rgba(255,255,255,0.7)'
    }
})

export default LogOutButton