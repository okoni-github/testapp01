import React from 'react';
import {
    View, Text, TextInput, Alert,
    TouchableOpacity, StyleSheet
} from "react-native";
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../config'
import Button from '../../components/Button';

const handlePress = (email: string, password: string): void => {
    // 会員登録
    createUserWithEmailAndPassword(auth, email, password)
        // 成功
        .then((userCredential) => {
            console.log(userCredential.user.uid)
            router.replace('/memo/List') //メモリスト画面へ遷移
        })
        // 失敗
        .catch((error) => {
            const { code, message } = error
            console.log(code, message)
            Alert.alert(message)
        })
}

const SignUp = ():JSX.Element => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    return(
        <View style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>Sign Up</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(text)=>{ setEmail(text) }}
                    autoCapitalize='none'
                    keyboardType='email-address'
                    placeholder='Email Address'
                    textContentType='emailAddress'
                />
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={(text) => { setPassword(text) }}
                    autoCapitalize='none'
                    secureTextEntry
                    placeholder='Password'
                    textContentType='password'
                />
                <Button label='submit' onPress={() => { handlePress(email, password) }}/>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>もうすでにアカウントがありますか？</Text>
                    <Link href='/auth/log_in' asChild replace>
                        <TouchableOpacity>
                            <Text style={styles.footerLink}>ここからログイン</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8'
    },
    inner: {
        paddingVertical: 24,
        paddingHorizontal: 27
    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: 'bold',
        marginBottom: 24
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDDDDD',
        backgroundColor: '#FFFFFF',
        height: 48,
        padding: 8,
        fontSize: 16,
        marginBottom:16
    },
    footer: {
        flexDirection: 'row'
    },
    footerText: {
        fontSize: 14,
        lineHeight: 24,
        marginRight: 8,
        color: '#000000'
    },
    footerLink: {
        fontSize: 14,
        lineHeight: 24,
        color: '#467FD3'
    }
})

export default SignUp