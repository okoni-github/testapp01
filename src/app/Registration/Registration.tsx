import React, { useEffect } from 'react';
import {useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from "react-native";

import { addDoc, collection, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { useNavigation } from 'expo-router';
import { Provider as PaperProvider, SegmentedButtons, Snackbar } from 'react-native-paper';

import Footer from '../Footer';
import LogOutButton from '@/src/components/LogOutButton';
import AccountButton from '@/src/components/AccountButton';
import LargeButton from '@/src/components/largeButton';
import { auth, db } from '@/src/config';

import KeyboardAccessory from '@/src/components/KeyboardAccessory';

const Registration = ():JSX.Element => {
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation()
  // 画面表示の際に一度だけログアウトボタンを表示する
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <LogOutButton /> },
      headerLeft: () => { return <AccountButton /> }
    })
  }, [])
  const [selectedTab, setSelectedTab] = useState('income');
  const [value, setValue] = useState('');

  const handlePress = () => {
    if (auth.currentUser === null) { return }

    const transactionsRef = collection(db, `users/${auth.currentUser.uid}/transactions`);
    const assetAmountRef = doc(db, `users/${auth.currentUser.uid}/assetAmount`, 'assetAmountId');

    // tempValueが0以上かどうかを確認
    if (Number(value) < 0) {
      setErrorMessage('0より小さい値は登録できません'); // エラーメッセージを設定
      setVisible(true); // Snackbar を表示するために visible を true に設定
      return; // ここで処理を中断
    }

    // 現在の資産額を取得
    getDoc(assetAmountRef)
      .then((docSnapshot) => {
        if (!docSnapshot.exists()) {
          console.error('No asset amount document found!');
          return;
        }

      const currentAssetAmount = docSnapshot.data().assetAmount;
      const transactionType = selectedTab === 'income' ? 'income' : 'expense';
      const newTransactionAmount = Number(value);

      // トランザクションを FireStore に保存
      return addDoc(transactionsRef, {
        amount: newTransactionAmount,
        type: transactionType,
        date: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date())
      })
      .then(() => {
        // 資産額を更新
        const newAssetAmount = transactionType === 'income'
          ? currentAssetAmount + newTransactionAmount
          : currentAssetAmount - newTransactionAmount;

        return setDoc(assetAmountRef, {
          assetAmount: newAssetAmount,
          updatedAt: Timestamp.fromDate(new Date())
        });
      });
    })
    .then(() => {
      // 成功後、入力フィールドをリセット
      setValue("");
      console.log(`${selectedTab === 'income' ? '収入' : '支出'}200が登録されました:`, value);
    })
    .catch((error) => {
      console.error('Error handling transaction:', error);
    });
  };

    return(     
        <PaperProvider>
          <View style={styles.container}>
            <Snackbar
              visible={visible}
              onDismiss={() => setVisible(false)} // Snackbar を非表示にする
              duration={3000} // 表示される時間
              action={{
                label: 'OK',
                onPress: () => {
                  setVisible(false); // 「OK」ボタンが押されたときに Snackbar を非表示
                },
              }}
              style={{ bottom: 68 }} // スタイルを追加して表示位置を調整
            >
              {errorMessage}
            </Snackbar>
            <View style={styles.mainContents}>
                <View style={styles.contentBox}>
                    <SegmentedButtons
                      style={styles.segmentedButtons}
                      value={selectedTab}
                      onValueChange={setSelectedTab}
                      buttons={[
                        {
                          value: 'income',
                          label: '収入',
                          style: selectedTab === 'income' ? styles.selectedButton : styles.button,  // 選択された時のスタイルと通常時のスタイルを分ける
                          labelStyle: styles.label,   // 文字のスタイル
                        },
                        {
                          value: 'expense',
                          label: '支出',
                          style: selectedTab === 'expense' ? styles.selectedButton : styles.button,  // 選択された時のスタイル
                          labelStyle: styles.label,   // 文字のスタイル
                        },
                      ]}
                    />
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={setValue}
                        placeholder="¥"
                        placeholderTextColor="#7F7F86"  // プレースホルダーの色を赤に設定
                        keyboardType="numeric"
                        inputAccessoryViewID="globalAccessoryID"  // InputAccessoryViewと関連付け
                      />
                      <LargeButton onPress={() => { handlePress() }} label='登録' width={48} fontSize={12} />
                      <KeyboardAccessory />
                    </View>
                </View>
              </View>
            </View>
            <Footer />
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
  container: {
    flex:1, //画面いっぱいに要素を広げる
    backgroundColor: '#F2F1F6',
  },
  mainContents: {
    alignItems: 'center'
  },
  contentBox: {
    marginTop: 24,
    width: 352,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 16
  },
  contentTitle: {
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 16
  },
  segmentedButtons: {
    width: 152,
    height: 32,
    fontSize: 8,
    alignItems: 'center',       // ボタン内のコンテンツの水平配置
  },
  button: {
    height: 32,                // ボタンの高さ
    paddingVertical: 0,         // ボタンの上下のパディングを調整
    justifyContent: 'center',   // 垂直方向に中央揃え
    backgroundColor: '#ffffff',  // 選択時の背景色
  },
  selectedButton: {
    height: 32,                // ボタンの高さ
    paddingVertical: 0,         // ボタンの上下のパディングを調整
    justifyContent: 'center',   // 垂直方向に中央揃え
    backgroundColor: '#FFC30F',  // 選択時の背景色
  },
  label: {
    fontSize: 12,               // 文字の大きさ
    lineHeight: 13,             // 行の高さ (文字が隠れないように)
  },
  inputContainer: {
    flexDirection: 'row',  // 子要素を横並びにする,
    marginTop: 44,
  },
  input: {
    backgroundColor: '#E3E3EA',
    borderRadius: 8,
    width: 152,
    height: 32,
    fontSize: 18,
    marginRight: 120,
    padding: 8,
  },
})

export default Registration