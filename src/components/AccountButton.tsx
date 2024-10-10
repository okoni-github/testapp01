import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const AccountButton = (): JSX.Element => {
    return(
        <Link href='/Account/Account' asChild>
            <TouchableOpacity>
                <MaterialIcons name='face' size={26}  color='#ffffff'/>
            </TouchableOpacity>
        </Link>
    )
}

export default AccountButton