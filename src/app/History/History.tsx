import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Modal,
  Button,
} from "react-native";

import { useNavigation } from 'expo-router';

import Footer from '../Footer';
import LogOutButton from '@/src/components/LogOutButton';
import AccountButton from '@/src/components/AccountButton';
import TransactionListItem from '@/src/components/TransactionListItem';
import { auth, db } from '@/src/config';
import { collection, getDocs, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { Transaction } from '@/types/transaction';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const History = ():JSX.Element => {
  const[transactions, setTransactions] = useState<Transaction[]>([])

  const navigation = useNavigation()
  // 画面表示の際に一度だけログアウトボタンを表示する
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <LogOutButton /> },
      headerLeft: () => { return <AccountButton /> }
    })
  }, [])

  // 収支データをFireStoreから取得
  useEffect(() => {
    if (auth.currentUser === null) { return }
    const ref = collection(db, `users/${auth.currentUser.uid}/transactions`)
    const q = query(ref, orderBy('date', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const remoteTransactions: Transaction[] = []
      snapshot.forEach((doc) => {
        const { amount, type, date, updatedAt } = doc.data()
        remoteTransactions.push({
          id: doc.id,
          amount,
          type,
          date,
          updatedAt
        })
      })
      setTransactions(remoteTransactions)
    })
    return unsubscribe
  }, [])

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 0が1月、1が2月...

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  // 当月かどうかの判定
  const isCurrentMonth = year === currentYear && month === currentMonth;

  // 当月の開始日と終了日を計算
  const getMonthStartEnd = (year: number, month: number) => {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);
    return {
      start: Timestamp.fromDate(startOfMonth),
      end: Timestamp.fromDate(endOfMonth)
    };
  };

  useEffect(() => {
    const { start, end } = getMonthStartEnd(year, month);

    const loadTransactions = () => {
      if (auth.currentUser === null) { return }
      
      const transactionsRef = collection(db, `users/${auth.currentUser.uid}/transactions`);
      const q = query(
        transactionsRef,
        where('date', '>=', start),
        where('date', '<=', end)
      );

      getDocs(q)
        .then((querySnapshot) => {
          const transactionList: Transaction[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            // Firestoreから取得したデータをTransaction型にマッピング
            return {
              id: doc.id,  // FirestoreドキュメントのIDをセット
              amount: data.amount, // データからamountを取得
              type: data.type, // データからtypeを取得
              date: data.date, // データからdateを取得 (適切にFirestoreのTimestampを扱う)
              updatedAt: data.updatedAt // データからupdatedAtを取得 (Timestamp型)
            } as Transaction;
          });
          setTransactions(transactionList);
        })
        .catch((error) => {
          console.error("Error fetching transactions: ", error);
        });
    };

    loadTransactions();
  }, [year, month]);

  const handlePreviousMonth = () => {
    setMonth(prevMonth => {
      if (prevMonth === 1) {
        setYear(prevYear => prevYear - 1); // 前の年に
        return 12; // 12月にリセット
      } else {
        return prevMonth - 1; // 前月にする
      }
    });
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1); // 1月にリセット
      setYear(prev => prev + 1); // 次の年に進む
    } else {
      setMonth(prev => (prev % 12) + 1); // 月を+1し、12月を超えないようにする
    }
  };

  const [yearMonthOptions, setYearMonthOptions] = useState<string[]>([]); // 年月の選択肢
  const [selectedYearMonth, setSelectedYearMonth] = useState(`${currentYear}年${currentMonth}月`); // デフォルトは現在の年月
  const [isPickerVisible, setPickerVisible] = useState(false); // ピッカー表示のトグル

  useEffect(() => {
    if (auth.currentUser === null) return;

    const ref = collection(db, `users/${auth.currentUser.uid}/transactions`);
    // Firestoreから年月の最小・最大を取得
    getDocs(ref).then((querySnapshot) => {
      if (querySnapshot.empty) return;

      const dates = querySnapshot.docs.map(doc => doc.data().date.toDate());
      const oldestDate = new Date(Math.min(...dates));
      const newestDate = new Date(Math.max(...dates));
      
      const options = [];
      for (let year = oldestDate.getFullYear(); year <= newestDate.getFullYear(); year++) {
        const startMonth = year === oldestDate.getFullYear() ? oldestDate.getMonth() + 1 : 1;
        const endMonth = year === newestDate.getFullYear() ? newestDate.getMonth() + 1 : 12;

        for (let month = startMonth; month <= endMonth; month++) {
          options.push(`${year}年${month}月`);
        }
      }
      setYearMonthOptions(options);
    }).catch(error => {
      console.error('Error fetching transactions: ', error);
    });
  }, []);


  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);

  // ピッカーで選択した年月を確定し、yearとmonthにセット
  const handleConfirm = () => {
    // 選択された年月（"YYYY年MM月"）から年と月を分割
    const match = selectedYearMonth.match(/\d+/g); // 年月を数字の配列に変換
    if (match) {
      const [selectedYear, selectedMonth] = match.map(Number); // 数字に変換
      // 選択した年月をそれぞれセット
      setYear(selectedYear);
      setMonth(selectedMonth);
    } else {
      console.error("Invalid year/month format:", selectedYearMonth);
    }

    hidePicker(); // ピッカーを閉じる
  };

    return(
        <View style={styles.container}>
              <View style={styles.monthNavigator}>
                <TouchableOpacity onPress={handlePreviousMonth}>
                  <View style={styles.circleItem}>
                    <MaterialIcons name='chevron-left' size={32} color='#FDFDFF'/>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={showPicker} style={styles.displayContainer}>
                  <Text style={styles.monthNavigatorText}>{year}年{month}月</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNextMonth}
                  disabled={isCurrentMonth}
                >
                  <View style={[styles.circleItem, isCurrentMonth && styles.disabledCircleItem]}>
                    <MaterialIcons name='chevron-right' size={32} color='#FDFDFF'/>
                  </View>
                </TouchableOpacity>
              </View>
              <FlatList
                data={transactions}
                renderItem={({ item }) => <TransactionListItem transaction={item} /> }
              />
              <Modal visible={isPickerVisible} animationType='fade'>
                <View style={styles.modalContainer}>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedYearMonth}
                      onValueChange={(itemValue) => setSelectedYearMonth(itemValue)}
                      style={styles.picker}
                    >
                      {yearMonthOptions.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                      ))}
                    </Picker>
                    <Button title="完了" onPress={handleConfirm} />
                  </View>
                </View>
              </Modal>
              <Footer />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex:1, //画面いっぱいに要素を広げる
    backgroundColor: '#ffffff',
  },
  monthNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',     // 横方向中央揃え
    height: 56,
    paddingHorizontal: 41,
    borderBottomColor: '#C4C5C9',
    borderBottomWidth: 0.1,
    // iOS用のシャドウ設定
    shadowColor: '#000000',        // 影の色
    shadowOffset: { width: 0, height: 1 }, // 影のオフセット (x: 0, y: 2)
    shadowOpacity: 0.25,           // 不透明度 (25%)
    shadowRadius: 2,               // ボカシ具合
    // Android用のシャドウ設定
    elevation: 5,                  // ボカシに相当する値
    backgroundColor: '#FBFCFE', // 背景色を設定することで影が見やすくなる,
    zIndex: 10, // これで前面に表示される

  },
  circleItem: {
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: '#FFC30F',
    justifyContent: 'center', // 縦方向中央揃え
    alignItems: 'center',     // 横方向中央揃え
  },
  disabledCircleItem: {
    opacity: 0.4, // 少し透明にして無効感を演出
  },
  monthNavigatorText: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  displayContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  displayText: {
    fontSize: 18,
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  picker: {
    width: 240,
  },
})

export default History