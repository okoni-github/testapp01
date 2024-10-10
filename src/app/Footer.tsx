import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from "react-native";


const Footer = (): JSX.Element => {
    return (
        <View style={styles.footer}>
            {/* <Text style={styles.comingSoon}>ComingSoon</Text> */}
            <View style={styles.footerInner}>
                <Link href='/Registration/Registration' asChild>
                    <TouchableOpacity style={styles.footerItem}>
                        <MaterialIcons style={styles.footerItemIcon} name='app-registration' size={32} color='#000000' />
                        <Text style={styles.footerItemTitle}>登録</Text>
                    </TouchableOpacity>
                </Link>
                <Link href='/History/History' asChild>
                    <TouchableOpacity style={styles.footerItem}>
                        <MaterialIcons style={styles.footerItemIcon} name='date-range' size={32} color='#000000' />
                        <Text style={styles.footerItemTitle}>履歴</Text>
                    </TouchableOpacity>
                </Link>
                <Link href='/Dashboard/DashBoard' asChild>
                    <TouchableOpacity style={styles.footerItem}>
                        <MaterialIcons style={styles.footerItemIcon} name='dashboard' size={32} color='#000000' />
                        <Text style={styles.footerItemTitle}>データ</Text>
                    </TouchableOpacity>
                </Link>
                <Link href='/Settings/Settings' asChild>
                    <TouchableOpacity style={styles.footerItem}>
                        <MaterialIcons style={styles.footerItemIcon} name='list-alt' size={32} color='#000000' />
                        <Text style={styles.footerItemTitle}>詳細</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    // comingSoon: {
    //     position: 'absolute',
    //     top: '15%',
    //     right: '18%',
    //     borderRadius: 8,
    //     width: 240,
    //     height: 40,
    //     zIndex: 100,
    //     textAlign: 'center',
    //     justifyContent: 'center',
    //     fontSize: 24,
    //     fontWeight: 'bold',
    //     paddingTop: 4,
    //     color: '#FFC30F',
    //     backgroundColor: '#ffffff',
    // },
    footer: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        height: 88,
        backgroundColor: '#FFC30F'
    },
    footerInner: {
        flexDirection: 'row',
        justifyContent: 'center', // 垂直方向の中央寄せ
    },
    footerItem: {
        width: 80,
        height: 88,
        marginTop: 8,
        alignItems: 'center',
    },
    footerItemIcon: {
        marginBottom: 4
    },
    footerItemTitle: {
        fontSize: 12,
        lineHeight: 16,
        color: '#000000'
    }
})

export default Footer