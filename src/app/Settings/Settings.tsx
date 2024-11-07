import React from 'react';
import {useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import { useNavigation } from 'expo-router';
import { setDoc, onSnapshot, Timestamp, doc } from 'firebase/firestore';
import { Provider as PaperProvider, Snackbar } from 'react-native-paper';


import { auth, db } from '../../config'
import Footer from '../Footer';
import SmallButton from '@/src/components/smallButton';
import LargeButton from '@/src/components/largeButton';
import LogOutButton from '@/src/components/LogOutButton';
import AccountButton from '@/src/components/AccountButton';
import saveAssetTrendsData from '../helpers/saveAssetTrendsData';
import KeyboardAccessory from '@/src/components/KeyboardAccessory';

const Settings = ():JSX.Element => {
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [age, setAge] = useState(1) // 年齢
  const [assetAmount, setAssetAmount] = useState(1) // 資産額
  const [incomeForecast, setIncomeForecast] = useState(1) // 収入予測
  const [expendituresForecast, setExpendituresForecast] = useState(1) // 支出予測

  // 一時使用の変数
  const [tempAge, setTempAge] = useState(age);
  const [tempAssetAmount, setTempAssetAmount] = useState(assetAmount);
  const [tempIncomeForecast, setTempIncomeForecast] = useState(incomeForecast);
  const [tempExpendituresForecast, setTempExpendituresForecast] = useState(expendituresForecast);


  const navigation = useNavigation()
  // 画面表示の際に一度だけログアウトボタンを表示する
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <LogOutButton /> },
      headerLeft: () => { return <AccountButton /> }
    })
  }, [])

  const handlePress = (
    field: string,
    setValue: React.Dispatch<React.SetStateAction<number>>,
    tempValue: number,
    setTempValue: React.Dispatch<React.SetStateAction<number>>,
    fieldPath: string
  ): void => {
  if (auth.currentUser === null) { return }

  // tempValueが0以上かどうかを確認
  if (tempValue < 0) {
    setErrorMessage('0より小さい値は登録できません'); // エラーメッセージを設定
    setVisible(true); // Snackbar を表示するために visible を true に設定
    return; // ここで処理を中断
  }

  const docRef = doc(db, `users/${auth.currentUser.uid}/${field}/${fieldPath}`);
  setDoc(docRef, {
    [field]: tempValue,
    updatedAt: Timestamp.fromDate(new Date())
  })
    .then(() => {
      if (auth.currentUser === null) { return }
      console.log(`${field} updated:`, tempValue);

      // フォームのクリア
      setValue(tempValue);
      setTempValue(1);
      
      saveAssetTrendsData(auth.currentUser);

    })
    .catch((error) => {
      console.error(`Failed to update ${field}:`, error);
    });
  };

  // ageの監視
  useEffect(() => {
    if (auth.currentUser === null) { return }

    // 特定のドキュメント(ageId)を監視
    const ref = doc(db, `users/${auth.currentUser.uid}/age`, 'ageId');

    // ドキュメントの変更を監視
    const unsubscribe = onSnapshot(ref, (doc) => {
      if (doc.exists()) {
        setAge(doc.data().age); // 取得したageデータをステートに保存
      } else {
        console.log('設定画面', 'No such document!');
      }
    });

  return unsubscribe; // クリーンアップのためのunsubscribe
}, []);

  // assetAmountの監視
  useEffect(() => {
    if (auth.currentUser === null) { return }

    // 特定のドキュメント(assetAmountId)を監視
    const ref = doc(db, `users/${auth.currentUser.uid}/assetAmount`, 'assetAmountId');

    // ドキュメントの変更を監視
    const unsubscribe = onSnapshot(ref, (doc) => {
      if (doc.exists()) {
        setAssetAmount(doc.data().assetAmount); // 取得したassetAmountデータをステートに保存
      } else {
        console.log('設定画面', 'No such document!');
      }
    });

  return unsubscribe; // クリーンアップのためのunsubscribe
}, []);

  // incomeForecastの監視
  useEffect(() => {
    if (auth.currentUser === null) { return }

    // 特定のドキュメント(incomeForecastId)を監視
  const ref = doc(db, `users/${auth.currentUser.uid}/incomeForecast`, 'incomeForecastId')

    // ドキュメントの変更を監視
    const unsubscribe = onSnapshot(ref, (doc) => {
      if (doc.exists()) {
        setIncomeForecast(doc.data().incomeForecast); // 取得したincomeForecastデータをステートに保存
      } else {
        console.log('設定画面', 'No such document!');
      }
    });

  return unsubscribe; // クリーンアップのためのunsubscribe
}, []);

  // expendituresForecastの監視
  useEffect(() => {
    if (auth.currentUser === null) { return }

    // 特定のドキュメント(expendituresForecastId)を監視
    const ref = doc(db, `users/${auth.currentUser.uid}/expendituresForecast`, 'expendituresForecastId');

    // ドキュメントの変更を監視
    const unsubscribe = onSnapshot(ref, (doc) => {
      if (doc.exists()) {
        setExpendituresForecast(doc.data().expendituresForecast); // 取得したexpendituresForecastデータをステートに保存
      } else {
        console.log('設定画面', 'No such document!');
      }
    });

  return unsubscribe; // クリーンアップのためのunsubscribe
}, []);

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
              <View style={styles.row}>
                <View style={styles.content}>
                  <Text style={styles.contentTitle}>年齢</Text>
                  <View style={styles.ageBox}>
                    <View style={styles.displayText}>
                        <Text style={styles.displayAge}>{age}</Text>
                        <Text style={styles.displaySubText}>歳</Text>
                    </View>
                    <View style={styles.row}>
                      <TextInput
                      style={styles.ageInput}
                      value={tempAge.toString()}
                      onChangeText={(text) => { setTempAge(Number(text)) }}
                      placeholder="歳"
                      keyboardType="numeric"  // 追加: 数値入力用のキーボードを表示
                      inputAccessoryViewID="globalAccessoryID"  // InputAccessoryViewと関連付け
                      />
                      <SmallButton onPress={() => {
                        handlePress(
                          'age',
                          setAge,
                          tempAge,
                          setTempAge,
                          'ageId'
                        )}} label='更新' 
                      />
                      <KeyboardAccessory />
                    </View>
                  </View>
                </View>
                <View style={styles.content}>
                  <Text style={styles.contentTitle}>現在の資産額</Text>
                  <View style={styles.assetBox}>
                    <View style={styles.displayText}>
                      <Text style={styles.displaySubText}>¥</Text>
                      <Text style={styles.displayAge}>{assetAmount.toLocaleString()}</Text>
                    </View>
                    <View style={styles.row}>
                      <TextInput
                      style={styles.assetAmountInput}
                      value={tempAssetAmount.toString()}
                      onChangeText={(text) => { setTempAssetAmount(Number(text)) }}
                      placeholder="¥"
                      keyboardType="numeric"  // 追加: 数値入力用のキーボードを表示
                      inputAccessoryViewID="globalAccessoryID"  // InputAccessoryViewと関連付け
                      />
                      <LargeButton onPress={() => {
                        handlePress(
                          'assetAmount',
                          setAssetAmount,
                          tempAssetAmount,
                          setTempAssetAmount,
                          'assetAmountId'
                        )}} label='更新' width={48}
                      />
                      <KeyboardAccessory />
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.content}>
                  <Text style={styles.contentTitle}>収入予測</Text>
                  <View style={styles.incomeForecastBox}>
                    <View style={styles.displayText}>
                      <Text style={styles.displaySubText}>¥</Text>
                      <Text style={styles.displayAge}>{incomeForecast.toLocaleString()}</Text>
                    </View>
                    <View style={styles.row}>
                      <TextInput
                      style={styles.incomeForecastInput}
                      value={tempIncomeForecast.toString()}
                      onChangeText={(text) => { setTempIncomeForecast(Number(text)) }}
                      placeholder="¥"
                      keyboardType="numeric"  // 追加: 数値入力用のキーボードを表示
                      inputAccessoryViewID="globalAccessoryID"  // InputAccessoryViewと関連付け
                      />
                      <SmallButton onPress={() => {
                        handlePress(
                          'incomeForecast',
                          setIncomeForecast,
                          tempIncomeForecast,
                          setTempIncomeForecast,
                          'incomeForecastId'
                        )}} label='登録'
                      />
                      <KeyboardAccessory />
                    </View>
                  </View>
                </View>
                <View style={styles.content}>
                  <Text style={styles.contentTitle}>支出予測</Text>
                  <View style={styles.expendituresForecastBox}>
                    <View style={styles.displayText}>
                      <Text style={styles.displaySubText}>¥</Text>
                      <Text style={styles.displayAge}>{expendituresForecast.toLocaleString()}</Text>
                    </View>
                    <View style={styles.row}>
                      <TextInput
                      style={styles.expendituresForecastInput}
                      value={tempExpendituresForecast.toString()}
                      onChangeText={(text) => { setTempExpendituresForecast(Number(text)) }}
                      placeholder="¥"
                      keyboardType="numeric"  // 追加: 数値入力用のキーボードを表示
                      inputAccessoryViewID="globalAccessoryID"  // InputAccessoryViewと関連付け
                      />
                      <SmallButton onPress={() => {
                        handlePress(
                          'expendituresForecast',
                          setExpendituresForecast,
                          tempExpendituresForecast ,
                          setTempExpendituresForecast,
                          'expendituresForecastId'
                        )}} label='登録'
                      />
                      <KeyboardAccessory />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <Footer />
          </View>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
  container: {
    flex:1, //画面いっぱいに要素を広げる
    backgroundColor: '#ffffff',
  },
  mainContents: {
    alignItems: 'center'
  },
  content: {
    marginTop: 24,
  },
  contentTitle: {
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 16
  },
  row: {
    flexDirection: 'row',  // 子要素を横並びにする
  },
  ageBox: {
    width: 104,
    height: 80,
    marginRight: 16,
    backgroundColor:"#D9D9D9",
    padding: 8,
    borderRadius: 8,
    /* shadow */
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
    ageInput: {
    height: 24,
    textAlign: 'right',
    paddingRight: 4,
    width: 56,
    borderRadius: 8,
    backgroundColor:'#ffffff'
  },
  displayText: {
    flexDirection: 'row', 
    height: 24,
    marginBottom: 12
  },
  displayAge: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  displaySubText: {
    fontSize: 12,
    marginTop: 7,
    marginLeft: 2,
  },
  assetAmountInput: {
    textAlign: 'left',
    height:24,
    padding: 4,
    width: 160,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor:'#ffffff'
  },
  assetBox: {
    width: 232,
    height: 80,
    backgroundColor:"#D9D9D9",
    padding: 8,
    borderRadius: 8,
    /* shadow */
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  incomeForecastInput: {
    textAlign: 'left',
    height: 24,
    padding: 4,
    width: 120,
    borderRadius: 8,
    backgroundColor:'#ffffff'
  },
  incomeForecastBox: {
    width: 168,
    height: 80,
    marginRight: 16,
    backgroundColor:"#D9D9D9",
    padding: 8,
    borderRadius: 8,
    /* shadow */
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  expendituresForecastInput: {
    textAlign: 'left',
    height: 24,
    padding: 4,
    width: 120,
    borderRadius: 8,
    backgroundColor:'#ffffff'
  },
  expendituresForecastBox: {
    width: 168,
    height: 80,
    backgroundColor:"#D9D9D9",
    padding: 8,
    borderRadius: 8,
    /* shadow */
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
})

export default Settings