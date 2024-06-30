import React from 'react';
import {
    View, TextInput, StyleSheet, KeyboardAvoidingView
} from "react-native";

import Header from '@/src/components/Haeder';
import CircleButton from '@/src/components/circleButton';
import Icon from '@/src/components/icon';

const Edit = ():JSX.Element => {
    return(
        //キーボードが上がってくると画面が縮小される
        <KeyboardAvoidingView behavior='height' style={styles.container}>
            <Header />
            <View style={styles.inputContainer}>
                <TextInput multiline style={styles.input} value={'買い物\nリスト'}/>
            </View>
            <CircleButton>
                <Icon name='check' size={40} color='#ffffff'/>
            </CircleButton>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        paddingVertical: 32,
        paddingHorizontal: 27,
        flex: 1,
    },
    input: {
        flex: 1,
        textAlignVertical: 'top', //Android
        fontSize: 16,
        lineHeight: 24
    }
})

export default Edit