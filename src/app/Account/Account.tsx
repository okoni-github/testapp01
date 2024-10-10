import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet} from "react-native";
import { router } from 'expo-router';

import { getAuth, deleteUser } from "firebase/auth";
import { auth } from '../../config';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '../Footer';

const handlePress = (): void => {
    if(auth.currentUser === null) { return } 
    Alert.alert('アカウントを削除します', 'よろしいですか？', [
        {
            text: 'キャンセル'
        },
        {
            text: '削除する',
            // 赤文字で表示する ※iosのみ
            style: 'destructive',
            // 削除するを選択した場合に削除処理を実行する
            onPress: () => {
                const getauth = getAuth();
                const user = getauth.currentUser;
                if(user){
                    deleteUser(user)
                        .then(() => {
                            Alert.alert('アカウントを削除しました')
                            router.replace('/auth/sign_up') //サインイン画面へ遷移
                        })
                        .catch((error) => {
                            console.log(error)
                            Alert.alert('アカウント削除に失敗しました')
                        })
                }
            }
        }
    ])
}

const Account = ():JSX.Element => {
    return (
        <View style={styles.container}>
            <View style={styles.deleteContainer}>
                <Text style={styles.deleteText}>アカウント削除</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={handlePress}>
                    <MaterialIcons name='face-retouching-off' size={40} color='#000000' />
                </TouchableOpacity>
            </View>
            <Footer />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    deleteContainer: {
        marginTop: 16,
        justifyContent: 'center', // 垂直方向の中央揃え
        alignItems: 'center', // 水平方向の中央揃え
    },
    deleteText: {
        marginBottom: 8
        // "アカウント削除" テキストのスタイル
    },
    deleteButton: {
        // アカウント削除ボタンのスタイル
    },
});
export default Account