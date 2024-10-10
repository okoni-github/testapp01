import React, { useEffect } from 'react';
import {useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";

import { addDoc, collection, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { useNavigation } from 'expo-router';
import { Provider as PaperProvider, SegmentedButtons, Snackbar } from 'react-native-paper';

import Footer from '../Footer';
import SmallButton from '@/src/components/smallButton';
import LogOutButton from '@/src/components/LogOutButton';
import AccountButton from '@/src/components/AccountButton';
import { auth, db } from '@/src/config';

import saveAssetTrendsData from '../helpers/saveAssetTrendsData';

const Registration = ():JSX.Element => {
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [incomeActual, setIncomeActual] = useState(0) // 収入実績
  const [expenditureActual, setExpenditureActual] = useState(0) // 支出実績

  const navigation = useNavigation()
  // 画面表示の際に一度だけログアウトボタンを表示する
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <LogOutButton /> },
      headerLeft: () => { return <AccountButton /> }
    })
  }, [])

  const handlePressIncomeActual = (): void => {
  //   if (auth.currentUser === null) { return }

  //   // tempValueが0以上かどうかを確認
  //   if (Number(incomeActual) < 0) {
  //     setErrorMessage('0より小さい値は登録できません'); // エラーメッセージを設定
  //     setVisible(true); // Snackbar を表示するために visible を true に設定
  //     return; // ここで処理を中断
  //   }

  //   const incomeActualRef = collection(db, `users/${auth.currentUser.uid}/incomeActual`)
  //   const assetAmountRef = doc(db, `users/${auth.currentUser.uid}/assetAmount`, 'assetAmountId');

  // // 現在の資産額を取得
  // getDoc(assetAmountRef)
  //   .then((doc) => {
  //     if (doc.exists()) {
  //       const currentAssetAmount = doc.data().assetAmount;

  //       // 収入額をFireStoreに追加
  //       addDoc(incomeActualRef, {
  //         incomeActual,
  //         updatedAt: Timestamp.fromDate(new Date())
  //       })
  //         .then(() => {
  //           // 資産額を収入額分増加させてFireStoreに更新
  //           const newAssetAmount = currentAssetAmount + Number(incomeActual);  // 収入額を加算
  //           setDoc(assetAmountRef, {
  //             assetAmount: newAssetAmount,
  //             updatedAt: Timestamp.fromDate(new Date())
  //           })
  //           .then(() => {
  //             if (auth.currentUser === null) { return }

  //             console.log('Asset amount updated successfully!');
  //             setIncomeActual(1);  // 収入実績の入力フィールドをリセット

  //             saveAssetTrendsData(auth.currentUser);

  //           })
  //           .catch((error) => {
  //             console.error('Error updating asset amount:', error);
  //           });
  //         })
  //         .catch((error) => {
  //           console.error('Error adding income actual:', error);
  //         });
  //     } else {
  //       console.error('No asset amount document found!');
  //     }
  //   })
  //   .catch((error) => {
  //     console.error('Error fetching asset amount:', error);
  //   });
  }

  const handlePressExpenditureActual = (): void => {
    // if (auth.currentUser === null) { return }

    // // tempValueが0以上かどうかを確認
    // if (Number(expenditureActual) < 0) {
    //   setErrorMessage('0より小さい値は登録できません'); // エラーメッセージを設定
    //   setVisible(true); // Snackbar を表示するために visible を true に設定
    //   return; // ここで処理を中断
    // }

    // const expenditureActualRef = collection(db, `users/${auth.currentUser.uid}/expenditureActual`)
    // const assetAmountRef = doc(db, `users/${auth.currentUser.uid}/assetAmount`, 'assetAmountId');

    // // 現在の資産額を取得
    // getDoc(assetAmountRef)
    //   .then((doc) => {
    //     if (doc.exists()) {
    //       const currentAssetAmount = doc.data().assetAmount;

    //       // 収入額をFireStoreに追加
    //       addDoc(expenditureActualRef, {
    //         expenditureActual,
    //         updatedAt: Timestamp.fromDate(new Date())
    //       })
    //         .then(() => {
    //           // 資産額を収入額分増加させてFireStoreに更新
    //           const newAssetAmount = currentAssetAmount - Number(expenditureActual);  // 収入額を加算
    //           setDoc(assetAmountRef, {
    //             assetAmount: newAssetAmount,
    //             updatedAt: Timestamp.fromDate(new Date())
    //           })
    //           .then(() => {
    //             if (auth.currentUser === null) { return }

    //             console.log('Asset amount updated successfully!');
    //             setExpenditureActual(1);  // 収入実績の入力フィールドをリセット

    //             saveAssetTrendsData(auth.currentUser);

    //           })
    //           .catch((error) => {
    //             console.error('Error updating asset amount:', error);
    //           });
    //         })
    //         .catch((error) => {
    //           console.error('Error adding setExpenditure actual:', error);
    //         });
    //     } else {
    //       console.error('No asset amount document found!');
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching asset amount:', error);
    //   });
  }

  const [selectedTab, setSelectedTab] = useState('income');
  const [value, setValue] = useState('');

    const handlePress = () => {
      if (selectedTab === 'income') {
        if (auth.currentUser === null) { return }

        // tempValueが0以上かどうかを確認
        if (Number(value) < 0) {
          setErrorMessage('0より小さい値は登録できません'); // エラーメッセージを設定
          setVisible(true); // Snackbar を表示するために visible を true に設定
          return; // ここで処理を中断
        }

        const incomeActualRef = collection(db, `users/${auth.currentUser.uid}/incomeActual`)
        const assetAmountRef = doc(db, `users/${auth.currentUser.uid}/assetAmount`, 'assetAmountId');

      // 現在の資産額を取得
      getDoc(assetAmountRef)
        .then((doc) => {
          if (doc.exists()) {
            const currentAssetAmount = doc.data().assetAmount;

            // 収入額をFireStoreに追加
            addDoc(incomeActualRef, {
              incomeActual: value,
              updatedAt: Timestamp.fromDate(new Date())
            })
              .then(() => {
                // 資産額を収入額分増加させてFireStoreに更新
                const newAssetAmount = currentAssetAmount + Number(value);  // 収入額を加算
                setDoc(assetAmountRef, {
                  assetAmount: newAssetAmount,
                  updatedAt: Timestamp.fromDate(new Date())
                })
                .then(() => {
                  if (auth.currentUser === null) { return }

                  console.log('Asset amount updated successfully!');
                  setValue("");  // 収入実績の入力フィールドをリセット

                  saveAssetTrendsData(auth.currentUser);

                })
                .catch((error) => {
                  console.error('Error updating asset amount:', error);
                });
              })
              .catch((error) => {
                console.error('Error adding income actual:', error);
              });
          } else {
            console.error('No asset amount document found!');
          }
        })
        .catch((error) => {
          console.error('Error fetching asset amount:', error);
        });
        console.log('収入が登録されました:', value);
        // 収入の登録処理
      } else if (selectedTab === 'expense') {
        if (auth.currentUser === null) { return }

        // tempValueが0以上かどうかを確認
        if (Number(value) < 0) {
          setErrorMessage('0より小さい値は登録できません'); // エラーメッセージを設定
          setVisible(true); // Snackbar を表示するために visible を true に設定
          return; // ここで処理を中断
        }

        const expenditureActualRef = collection(db, `users/${auth.currentUser.uid}/expenditureActual`)
        const assetAmountRef = doc(db, `users/${auth.currentUser.uid}/assetAmount`, 'assetAmountId');

        // 現在の資産額を取得
        getDoc(assetAmountRef)
          .then((doc) => {
            if (doc.exists()) {
              const currentAssetAmount = doc.data().assetAmount;

              // 収入額をFireStoreに追加
              addDoc(expenditureActualRef, {
                expenditureActual,
                updatedAt: Timestamp.fromDate(new Date())
              })
                .then(() => {
                  // 資産額を収入額分増加させてFireStoreに更新
                  const newAssetAmount = currentAssetAmount - Number(value);  // 収入額を加算
                  setDoc(assetAmountRef, {
                    assetAmount: newAssetAmount,
                    updatedAt: Timestamp.fromDate(new Date())
                  })
                  .then(() => {
                    if (auth.currentUser === null) { return }

                    console.log('Asset amount updated successfully!');
                    setValue("");  // 収入実績の入力フィールドをリセット

                    saveAssetTrendsData(auth.currentUser);

                  })
                  .catch((error) => {
                    console.error('Error updating asset amount:', error);
                  });
                })
                .catch((error) => {
                  console.error('Error adding setExpenditure actual:', error);
                });
            } else {
              console.error('No asset amount document found!');
            }
          })
          .catch((error) => {
            console.error('Error fetching asset amount:', error);
          });
            console.log('支出が登録されました:', value);
            // 支出の登録処理
      }
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
                <View style={styles.content}>
                  <View
                    style={{ width: 300 }}
                  >
                    <SegmentedButtons
                      value={selectedTab}
                      onValueChange={setSelectedTab}
                      buttons={[
                        { value: 'income', label: '収入' },
                        { value: 'expense', label: '支出' },
                      ]}
                    />
                    <View style={styles.inputContainer}>
                      {/* <Text style={styles.label}>
                        {selectedTab === 'income' ? '収入を入力' : '支出を入力'}
                      </Text> */}
                      <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={setValue}
                        placeholder="¥"
                        keyboardType="numeric"
                      />
                      <SmallButton onPress={() => { handlePress() }} label='登録' />
                    </View>
                  </View>
                  {/* <Text style={styles.contentTitle}>収入実績</Text>
                  <View style={styles.incomeActualBox}>
                    <View style={styles.row}>
                      <TextInput
                          style={styles.incomeActualInput}
                          value={incomeActual.toString()}
                          onChangeText={(text) => { setIncomeActual(Number(text)) }}
                          placeholder="¥"
                          keyboardType="numeric"  // 追加: 数値入力用のキーボードを表示
                      />
                      <SmallButton onPress={() => { handlePressIncomeActual() }} label='登録' />
                    </View>
                  </View> */}
                </View>
                {/* <View style={styles.content}> */}
                  {/* <Text style={styles.contentTitle}>支出実績</Text>
                  <View style={styles.expenditureActualBox}>
                    <View style={styles.row}>
                      <TextInput
                          style={styles.expenditureActualInput}
                          value={expenditureActual.toString()}
                          onChangeText={(text) => { setExpenditureActual(Number(text)) }}
                          placeholder="¥"
                          keyboardType="numeric"  // 追加: 数値入力用のキーボードを表示
                      />
                      <SmallButton onPress={() => { handlePressExpenditureActual() }} label='登録' />
                    </View>
                  </View> */}
                {/* </View> */}
              </View>
            </View>
            <Footer />
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
incomeActualInput: {
    textAlign: 'left',
    height: 24,
    padding: 4,
    width: 120,
    borderRadius: 8,
    backgroundColor:'#ffffff'
  },
  incomeActualBox: {
    width: 168,
    height: 48,
    backgroundColor:"#D9D9D9",
    paddingLeft: 8,
    paddingVertical: 12,
    marginRight: 16,
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
  expenditureActualInput: {
    textAlign: 'left',
    height: 24,
    padding: 4,
    width: 120,
    borderRadius: 8,
    backgroundColor:'#ffffff'
  },
  expenditureActualBox: {
    width: 168,
    height: 48,
    backgroundColor:"#D9D9D9",
    paddingLeft: 8,
    paddingVertical: 12,
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
  inputContainer: {
    marginTop: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    fontSize: 18,
    padding: 5,
  },
})

export default Registration