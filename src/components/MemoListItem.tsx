import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Link } from 'expo-router';
import { deleteDoc, doc } from 'firebase/firestore';

import {MaterialIcons } from '@expo/vector-icons';
import { type Memo } from '../../types/memo';
import { auth, db } from '../config'

interface Props {
    memo: Memo
}

const handlePress = (id: string): void => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id)
    Alert.alert('メモを削除します', 'よろしいですか？', [
        {
            text: 'キャンセル'
        },
        {
            text: '削除する',
            // 赤文字で表示する ※iosのみ
            style: 'destructive',
            // 削除するを選択した場合に削除処理を実行する
            onPress: () => {
                deleteDoc(ref)
                    .catch(() => { Alert.alert('削除に失敗しました')})
            }
        }
    ])
}

const memoListItem = (props: Props): JSX.Element | null => {
    const  { memo } = props
    const { bodyText, updatedAt } = memo
    if (bodyText === null || updatedAt === null) { return null }
    const dateString = updatedAt.toDate().toLocaleString('ja-JP')
    return(
        <Link
            href={{ pathname: '/memo/detail', params: { id:memo.id } }}
            asChild
        >
            <TouchableOpacity style={styles.memoListItem}>
                <View>
                    <Text numberOfLines={1} style={styles.memoListItemTitle}>{bodyText}</Text>
                    <Text style={styles.memoListItemDate}>{dateString}</Text>
                </View>
                <TouchableOpacity onPress={() => { handlePress(memo.id) }}>
                    <MaterialIcons name='delete' size={26}  color='#848484'/>
                </TouchableOpacity>
            </TouchableOpacity>
        </Link>

    )
}

const styles = StyleSheet.create({
    memoListItem: {
        backgroundColor: '#ffffff',
        flexDirection: 'row', //子要素を横方向に並べる //他のスタイルも縦横逆になる
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 19,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: "rgba(0,0,0,0.15)"
    },
    memoListItemTitle: {
        fontSize: 16,
        lineHeight: 32
    },
    memoListItemDate: {
        fontSize: 12,
        lineHeight: 16,
        color: "#848484"
    },
})

export default memoListItem