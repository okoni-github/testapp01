import React from 'react';
import { Stack } from 'expo-router'


// headerのカスタマイズ
const Layout = ():JSX.Element => {
    return <Stack screenOptions={{
        headerStyle: {
            backgroundColor: '#467FD3'
        },
        headerTintColor: '#ffffff',
        headerTitle: '家計簿 App',
        headerBackTitle: 'Back',
        headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold'
        }
}} />
}

export default Layout