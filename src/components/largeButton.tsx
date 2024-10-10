import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from "react-native";


interface Props{
    label: string
    width?: number
    onPress?: () => void
}

const LargeButton = (props:Props):JSX.Element => {
    const { label, width, onPress } = props
    return(
        <TouchableOpacity onPress={onPress} style={styles.largeButton}>
            <Text style={[styles.largeButtonlabel, width ? { width } : {}]}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  largeButton: {
    backgroundColor: "#FFC30F",
    // width: 48,
    height: 24,
    marginLeft: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  largeButtonlabel: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold'
  },
})

export default LargeButton