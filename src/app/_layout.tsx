import React from 'react';
import { Stack } from 'expo-router'

// headerのカスタマイズ
const Layout = ():JSX.Element => {
    return <Stack screenOptions={{
        headerStyle: {
            backgroundColor: '#FFC30F'
        },
        headerTintColor: '#ffffff',
        headerTitle: '100y Money',
        headerBackTitle: 'Back',
        headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
        },
        headerTitleAlign: 'center', //Androidだけ左寄せ
        headerBackVisible: false, // 戻るボタンを非表示
        animation: 'none', // アニメーションを無効化
}} />
}

export default Layout