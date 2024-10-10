import React from 'react';
import {
    View, TextInput, StyleSheet,
    Alert
} from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'

import KeyboardSafeView from '../../components/keyboardAvoidingView'
import CircleButton from '@/src/components/circleButton';
import Icon from '@/src/components/icon';
import { auth, db} from '../../config'

const handlePress = (id: string, bodyText: string): void => {
    if(auth.currentUser === null) { return } 
    const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id)
    setDoc(ref, {
        bodyText,
        updatedAt: Timestamp.fromDate(new Date())
    })
        .then(() => {
            // １つ前の画面に戻る
            router.back()
        })
        .catch((error) => {
            console.log(error)
            Alert.alert('更新に失敗しました')
        })
}

const Edit = ():JSX.Element => {
    // useLocalSearchParamsを使ってURLのクエリパラメータからidを取得
    const id = String(useLocalSearchParams().id)
    const [bodyText, setBodyText] = useState('')

    // この画面が表示されたときに一度だけ実行する
    useEffect(() => {
        // 現在のユーザーが認証されていない場合は何もしない
        if(auth.currentUser === null) { return }
        // Firestoreのドキュメント参照を作成
        const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id)
        // ドキュメントデータを取得
        getDoc(ref)
            .then((docRef) => {
                // Firestoreから取得したデータをbodyTextステートにセット
                const RemoteBodyText = docRef?.data()?.bodyText
                setBodyText(RemoteBodyText)
            })
            .catch((error) => {
                // エラーが発生した場合にコンソールにエラーメッセージを表示
                console.log(error)
            })
    }, [])
    return(
        // キーボードが表示されたときに画面が適切に調整されるようにする
        <KeyboardSafeView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    // 複数行のテキスト入力を許可
                    multiline
                    style={styles.input}
                    // bodyTextステートの値をテキスト入力の値として設定
                    value={bodyText}
                    // テキストが変更されたときにbodyTextステートを更新
                    onChangeText={(text) => { setBodyText(text) }}
                    // 自動的にテキストインプットにフォーカスする
                    autoFocus  
                />
            </View>
            <CircleButton
                // テキストが変更されたときにbodyTextステートを更新
                onPress={() => { handlePress(id, bodyText) }}
            >
                <Icon name='check' size={40} color='#ffffff'/>
            </CircleButton>
        </KeyboardSafeView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {

        flex: 1,
    },
    input: {
        flex: 1,
        textAlignVertical: 'top', //Android
        fontSize: 16,
        lineHeight: 24,
        paddingVertical: 32,
        paddingHorizontal: 27,
    }
})

export default Edit