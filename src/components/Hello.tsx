import React from 'react';
import { View, Text, StyleSheet, type TextStyle } from "react-native";

interface Props {
    children: string //Hello関数のchildrenの型を定義する
    bang?: boolean
    style?: TextStyle
}

const Hello = (props: Props): JSX.Element => {
    const { children, bang, style} = props
    return(
        <View>
            <Text style={[styles.text,style]}>
                Hello {children}{bang === true ? "!" : ""}
            </Text>
        </View>
    )
}

// スタイルシートの変更
const styles = StyleSheet.create({
    text: {
        color:'#ffffff',
        backgroundColor:'blue',
        fontSize:40,
        fontWeight:'bold',
        padding: 16,
    }
})

export default Hello