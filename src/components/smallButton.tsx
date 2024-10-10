import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from "react-native";


interface Props{
    label: string
    onPress?: () => void
}

const SmallButton = (props:Props):JSX.Element => {
    const { label, onPress } = props
    return(
        <TouchableOpacity onPress={onPress} style={styles.smallButton}>
            <Text style={styles.smallButtonlabel}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  smallButton: {
    backgroundColor: "#FFC30F",
    width: 24,
    height: 24,
    marginLeft: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  smallButtonlabel: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold'
  },
})

export default SmallButton