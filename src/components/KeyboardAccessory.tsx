import React from 'react';
import { View, Button, InputAccessoryView, Keyboard, StyleSheet } from 'react-native';

const KeyboardAccessory = () => {

  const inputAccessoryViewID = 'globalAccessoryID';

  return (
    <InputAccessoryView nativeID={inputAccessoryViewID}>
      <View style={styles.accessory}>
        <Button
          onPress={() => {
            Keyboard.dismiss(); // キーボードを非表示にする
          }}
          title="完了"
        />
      </View>
    </InputAccessoryView>
  );
};

const styles = StyleSheet.create({
  accessory: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
})

export default KeyboardAccessory;