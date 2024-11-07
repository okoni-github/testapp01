import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { Provider as PaperProvider, Snackbar } from 'react-native-paper';
import { router } from 'expo-router';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/src/config';

const UserRegistration = () => {

  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // 現在のステップを管理
  const [currentStep, setCurrentStep] = useState(1);

  // ステップを進める
  const handleNext = () => {
    const today = new Date();
    const birthDate = new Date(selectedYear, selectedMonth - 1, selectedDay);

   // 未来の日付をチェック
    if (birthDate > today) {
      // 今日より先の日付の場合エラーメッセージ
      setErrorMessage('未来の日付は設定できません'); // エラーメッセージを設定
      setVisible(true); // Snackbar を表示するために visible を true に設定
      return; // ここで処理を中断
    }

    // 正常な場合、次のステップへ進む
    setCurrentStep(currentStep + 1);
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // ステップを戻る
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 年と月の選択状態
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());


  // 月ごとの日数を取得する関数
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate(); // monthは1月を1としてカウント
  };


  // 年齢を計算
  const calculateAge = () => {
    const today = new Date();
    const birthDate = new Date(selectedYear, selectedMonth - 1, selectedDay); // 選択した年・月・日から日付を作成

    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();
    let ageDays = today.getDate() - birthDate.getDate();

    // 日がマイナスの場合、月から1引いて日を調整
    if (ageDays < 0) {
      ageMonths--;
      ageDays += getDaysInMonth(selectedYear, selectedMonth - 1); // 前の月の日数を加算
    }

    // 月がマイナスの場合、年から1引いて月を12に調整
    if (ageMonths < 0) {
      ageYears--;
      ageMonths += 12;
    }

    return `${ageYears}歳${ageMonths}ヶ月`;
  };

  // const handlePress = (
  //   field: string,
  //   setValue: React.Dispatch<React.SetStateAction<number>>,
  //   tempValue: number,
  //   setTempValue: React.Dispatch<React.SetStateAction<number>>,
  //   fieldPath: string
  // ): void => {
  // if (auth.currentUser === null) { return }

  // // tempValueが0以上かどうかを確認
  // if (tempValue < 0) {
  //   setErrorMessage('0より小さい値は登録できません'); // エラーメッセージを設定
  //   setVisible(true); // Snackbar を表示するために visible を true に設定
  //   return; // ここで処理を中断
  // }

  // const docRef = doc(db, `users/${auth.currentUser.uid}/${field}/${fieldPath}`);
  // setDoc(docRef, {
  //   [field]: tempValue,
  //   updatedAt: Timestamp.fromDate(new Date())
  // })
  //   .then(() => {
  //     if (auth.currentUser === null) { return }
  //     console.log(`${field} updated:`, tempValue);

  //     // フォームのクリア
  //     setValue(tempValue);
  //     setTempValue(1);
      
  //     saveAssetTrendsData(auth.currentUser);

  //   })
  //   .catch((error) => {
  //     console.error(`Failed to update ${field}:`, error);
  //   });
  // };

    const AgeStep = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <Text>生年月日を登録してください</Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{marginHorizontal: -6}}>
              <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue) => setSelectedYear(itemValue)}
                style={[styles.picker, styles.pickerYear]}
              >
                {Array.from({ length: 100 }, (_, i) => (
                  <Picker.Item
                    key={i}
                    label={`${new Date().getFullYear() - 99 + i}年`}
                    value={new Date().getFullYear() - 99 + i}
                  />
                ))}
              </Picker>
            </View>
            <View style={{marginHorizontal: -6}}>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => {
                  setSelectedMonth(itemValue);
                  setSelectedDay(1); // 月が変わったら日をリセット
                }}
                style={[styles.picker, styles.pickerMonth]}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <Picker.Item
                    key={i}
                    label={`${i + 1}月`}
                    value={i + 1}
                  />
                ))}
              </Picker>
            </View>
            <View style={{marginHorizontal: -6}}>
              <Picker
                selectedValue={selectedDay}
                onValueChange={(itemValue) => setSelectedDay(itemValue)}
                style={[styles.picker, styles.pickerDay]}
              >
                {Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => (
                  <Picker.Item
                    key={i}
                    label={`${i + 1}日`}
                    value={i + 1}
                  />
                ))}
              </Picker>
            </View>
          </View>
            <Text style={styles.ageText}>現在の年齢: {calculateAge()}</Text>
      </View>      
    )};

    const AssetsStep = () => {
    return (
        <Text>資産を登録してください</Text>
    )};

    const ForecastStep = () => {
    return (
        <Text>収支予測を登録してください</Text>
    )};


  // 各ステップのコンポーネント
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AgeStep />;
      case 2:
        return <AssetsStep />;
      case 3:
        return <ForecastStep />;
      default:
        return null;
    }
  };

  const handlePressNavigation = (): void => {

    const user = auth.currentUser;

    if (user) {
      if (auth.currentUser === null) { return }
      const isRegisteredRef = doc(db, `users/${auth.currentUser.uid}/isRegistered`, 'isRegisteredId');

      // 初回登録完了後にフラグを更新
      updateDoc(isRegisteredRef, {
        isRegistered: true,
        updatedAt: Timestamp.fromDate(new Date())
      })
        .then(() => {
          console.log("ユーザーの登録フラグが true に更新されました");
          router.replace('/Dashboard/DashBoard');  // ダッシュボードへ遷移
        })
        .catch((error) => {
          console.error("ユーザー登録の完了フラグを更新できませんでした:", error);
        });
    } else {
      console.error("ユーザー情報が取得できませんでした");
    }
  }


  const [animatedProgress] = useState(new Animated.Value(0));

  useEffect(() => {
    // const normalizedProgress = (currentStep - 1) / 2; // currentStep 1~3 を 0~1 に変換
    const normalizedProgress = currentStep / 3; // currentStep 1~3 を 0~1 に変換

    Animated.timing(animatedProgress, {
      toValue: normalizedProgress, // アニメーションさせたい目標の進捗（0〜1）
      duration: 300, // アニメーションの時間（ミリ秒）
      useNativeDriver: false, // ネイティブドライバを使わない設定
    }).start();
  }, [currentStep]);

  const widthInterpolate = animatedProgress.interpolate({
    inputRange: [0, 1], // 0% から 100% の間で進捗を定義
    outputRange: ['0%', '100%'], // 進捗に応じて幅を変える
  });

  return (
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
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progress,
                  { width: widthInterpolate }, // 幅をアニメーションで調整
                ]}
              />
            </View>
            {renderStep()}
          </View>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
              {currentStep > 1 && (
                // <TouchableOpacity style={{marginRight: 20}} onPress={handlePrevious}>
                <TouchableOpacity style={{marginRight: 20}} onPress={handlePrevious}>
                  {/* <Text style={styles.buttonText}>戻る</Text> */}
                  <Text>戻る</Text>
                </TouchableOpacity>
              )}
              {currentStep < 3 ? (
                // <TouchableOpacity style={styles.button} onPress={handleNext}>
                <TouchableOpacity onPress={handleNext}>
                  {/* <Text style={styles.buttonText}>次へ</Text> */}
                  <Text>次へ</Text>
                </TouchableOpacity>
              ) : (
                  // <TouchableOpacity style={styles.button} onPress={handlePressNavigation}>
                  <TouchableOpacity onPress={handlePressNavigation}>
                    {/* <Text style={styles.buttonText}>完了</Text> */}
                    <Text>完了</Text>
                  </TouchableOpacity>
              )}
          </View>
      </View>
    </PaperProvider>
  );
};

  const styles = StyleSheet.create({
  container: {
    flex:1, //画面いっぱいに要素を広げる
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContents: {
    width: 320,
    height: 480,
    // width: '88%',
    padding: 30,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    height: 16, // プログレスバーの高さ
    width: '100%', // プログレスバーの横幅（親コンテナに応じて）
    backgroundColor: '#e0e0e0', // 背景色
    borderRadius: 5, // 角を丸くする
    overflow: 'hidden', // 内側のバーがはみ出さないようにする
    marginBottom: 30
  },
  progress: {
    height: '100%', // 塗りつぶすバーの高さ
    backgroundColor: '#FFC30F', // 塗りつぶし部分の色
    borderRadius: 8, // 塗りつぶし部分の角を丸くする
  },
  picker: {
    height: 200,
    marginVertical: 10,
  },
  pickerYear: {
    width: 138,
  },
  pickerMonth: {
    width: 106
  },
  pickerDay: {
    width: 106
  },
  ageText: {
    fontSize: 18,
    marginTop: 20,
  },
})

export default UserRegistration;