import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from 'expo-router';

import {MaterialIcons } from '@expo/vector-icons';

const memoListItem = (): JSX.Element => {
    return(
        <Link href='/memo/detail' asChild>
            <TouchableOpacity style={styles.memoListItem}>
                <View>
                    <Text style={styles.memoListItemTitle}>買い物リスト</Text>
                    <Text style={styles.memoListItemDate}>2023年10月1日 10:00</Text>
                </View>
                <TouchableOpacity>
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