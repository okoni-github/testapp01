import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Link } from 'expo-router';
import { deleteDoc, doc, Timestamp } from 'firebase/firestore';

import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from '../config'
import { Transaction } from '@/types/transaction';

interface Props {
    transaction: Transaction
}

const handlePress = (id: string): void => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, `users/${auth.currentUser.uid}/transaction`, id)
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

const TransactionListItem = (props: Props): JSX.Element | null => {
    const  { transaction } = props
    const { amount, type, date, updatedAt } = transaction
    
    if (amount === null || type === null || date === null || updatedAt === null) { return null }

    const formatDateString = (date: Date | undefined) => {
        if (!date) { return }
        // 曜日を日本語で取得
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
        const weekday = weekdays[date.getDay()];
        // フォーマットを適用
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(${weekday}) ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const formattedDateString = formatDateString(
        date instanceof Timestamp ? date.toDate() : date
    );

    return(
            <Link
                href={{ pathname: '/History/Detail', params: { id:transaction.id } }}
                asChild
            >
                {/* <TouchableOpacity style={styles.memoListItem}> */}
                <View style={styles.transactionListItem}>
                    <View>
                        <Text style={styles.transactionListItemDate}>{formattedDateString}</Text>
                        <View style={styles.amountItem}>
                            <Text style={styles.currencySymbol}>¥</Text>
                            <Text numberOfLines={1} style={styles.amount}>{Number(amount).toLocaleString()}</Text>
                        </View>
                    </View>
                    <View style={styles.transactionTypeContainer}>
                        <Text style={styles.transactionType}>{type === 'income' ? '収入' : '支出' }</Text>
                    </View>
                    {/* <TouchableOpacity onPress={() => { handlePress(transaction.id) }}>
                        <MaterialIcons name='delete' size={26}  color='#848484'/>
                    </TouchableOpacity> */}
                </View>
                {/* </TouchableOpacity> */}
            </Link>
    )
}

const styles = StyleSheet.create({
    transactionListItem: {
        backgroundColor: '#ffffff',
        flexDirection: 'row', //子要素を横方向に並べる //他のスタイルも縦横逆になる
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 41,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: "rgba(0,0,0,0.15)"
    },
    amountItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencySymbol: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 3,
        paddingRight: 2
    },
    amount: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    transactionListItemDate: {
        fontSize: 12,
        color: "#848484",
        marginBottom: 8
    },
    transactionTypeContainer: {
        width:48,
        height: 24,
        backgroundColor: '#FFC30F',
        justifyContent: 'center', // 縦方向中央揃え
        alignItems: 'center',     // 横方向中央揃え
        borderRadius: 8,
    },
    transactionType: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: 'bold',
    }
})

export default TransactionListItem