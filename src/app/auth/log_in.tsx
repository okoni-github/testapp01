import React from 'react';
import {
    View, Text, TextInput,Alert,
    TouchableOpacity, StyleSheet,
} from "react-native";
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { signInWithEmailAndPassword, getAuth, signInAnonymously } from 'firebase/auth';

import Button from '../../components/Button';
import { auth, db } from '../../config';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

const handlePress = (email: string, password: string): void => {
    // ログイン
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            if (auth.currentUser === null) { return }
            const isRegisteredRef = doc(db, `users/${auth.currentUser.uid}/isRegistered`, 'isRegisteredId');
            getDoc(isRegisteredRef)
                .then((docSnapshot) => {
                    if (docSnapshot.exists() && docSnapshot.data()?.isRegistered) {
                        router.replace('/Dashboard/DashBoard'); // ダッシュボード画面へ遷移
                    } else {
                        router.replace('/UserRegistration/UserRegistration'); // ユーザー登録画面へ遷移
                    }
                })
                .catch((error) => {
                    console.error("ユーザーデータの取得に失敗しました:", error);
                    Alert.alert("データ取得に失敗しました");
                });
        })
        .catch((error) => {
            const { code, message } = error;
            console.log(code, message);
            Alert.alert(message);
        });
}

const gestHandlePress = (): void => {
    const getauth = getAuth();
    signInAnonymously(getauth)
        .then((userCredential) => {
            const uid = userCredential.user.uid;
            console.log(uid);
            const userDocRef = doc(db, `users/${uid}`);
            if (auth.currentUser === null) { return }
            const isRegisteredRef = doc(db, `users/${auth.currentUser.uid}/isRegistered`, 'isRegisteredId');
            setDoc(isRegisteredRef, {
                isRegistered: false,
                updatedAt: Timestamp.fromDate(new Date())
            }, { merge: true })
                .then(() => {
                    console.log("初期データをFirestoreに登録しました");
                    getDoc(userDocRef)
                        .then((docSnapshot) => {
                            console.log(docSnapshot)
                            if (docSnapshot.exists() && docSnapshot.data()?.isRegistered) {
                                router.replace('/Dashboard/DashBoard'); // ダッシュボード画面へ遷移
                            } else {
                                router.replace('/UserRegistration/UserRegistration'); // ユーザー登録画面へ遷移
                            }
                        })
                        .catch((error) => {
                            console.error("ユーザーデータの取得に失敗しました:", error);
                            Alert.alert("データ取得に失敗しました");
                        });
                })
                .catch((error) => {
                    console.error("初期データの登録に失敗しました:", error);
                    Alert.alert("データ登録に失敗しました");
                });
        })
        .catch((error) => {
            console.log(error);
            Alert.alert('ログインに失敗しました');
        });
}

const LogIn = ():JSX.Element => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    return(
        <View style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>Log In</Text>
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
                <Button label='submit' onPress={() => { handlePress(email, password) }} />
                <Button label='ゲストとしてログイン' onPress={gestHandlePress}/>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>アカウントがありませんか？</Text>
                    <Link href='/auth/sign_up' asChild replace>
                        <TouchableOpacity>
                            <Text style={styles.footerLink}>ここからサインアップ</Text>
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

export default LogIn