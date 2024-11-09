import React from 'react';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

import { doc, onSnapshot } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';

import { auth, db } from '../../config'
import Footer from '../Footer';
import { AssetTrendsData } from '@/types/AssetTrendsData';

import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import mobileAds, { BannerAdSize, GAMBannerAd, TestIds } from "react-native-google-mobile-ads";
import rewardedAd from '../hooks/rewardedAd';
import { useNavigation } from 'expo-router';
import LogOutButton from '@/src/components/LogOutButton';
import AccountButton from '@/src/components/AccountButton';

const DashBoard = ():JSX.Element => {

  const [selectedData, setSelectedData] = useState<null | DataPoint>(null);
  const [assetTrendsData, setAssetTrendsData] = useState<AssetTrendsData>({
    labels: ['0'],
    datasets: [
      {
        data: [0]
      }
    ]
  });

  useEffect(() => {
    (async () => {
      // トラッキング許可の要求
      const { status: trackingStatus } =
        await requestTrackingPermissionsAsync();
      if (trackingStatus !== "granted") {
        // 拒否された場合、ここでパーソナライズ広告のオフなどをする
      }

      // AdMob初期化
      await mobileAds().initialize();
    })();
  }, []);

  const navigation = useNavigation()
  // 画面表示の際に一度だけログアウトボタンを表示する
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => { return <LogOutButton /> },
      headerLeft: () => { return <AccountButton /> }
    })
  }, [])

useEffect(() => {  
  if (auth.currentUser === null) { return }

  // assetTrendsDataの監視
  const ref = doc(db, `users/${auth.currentUser.uid}/assetTrendsData`, 'assetTrendsDataId');

  const unsubscribe = onSnapshot(ref, (doc) => {

    if (doc.exists()) {
      const labels = doc.data().labels;
      const datasets = doc.data().datasets;

      const remoteAssetTrendsData: AssetTrendsData = {
        labels: labels,
        datasets
      };
      setAssetTrendsData(remoteAssetTrendsData);

    } else {
      console.log('No such document!');
    }
  }, (error) => {
    console.error('Error fetching document:', error);
  });

    return unsubscribe;

  }, []);

  const screenWidth = Dimensions.get('window').width;

// ラベルを均等に間引く関数
function filterLabelsEvenly(labels: string[], startAge: number, totalLabels: number = 7): string[] {
  const endAge = 100;  // 終了年齢
  const range = endAge - startAge;  // ラベル範囲
  const step = Math.floor(range / (totalLabels - 1));  // 均等に間引くステップを計算
  
  return labels.map((label, index) => {
    const age = startAge + index;
    
    if (age === startAge) return `${label}歳`;  // 最初のラベル（登録された年齢）
    
    // 最後の年齢が100歳以下かつラベルが8個未満の場合は表示
    if (age >= endAge && labels.length < totalLabels) return label;

    // ステップに基づいてラベルを表示
    return index % step === 0 ? `${label}歳` : '';
  });
}

// assetTrendsDataから年齢データを取得
const startAge = parseInt(assetTrendsData.labels[0], 10); // 最初の年齢データを数値に変換
console.log(startAge)
const labels = Array.from({ length: 101 }, (_, i) => i.toString());  // 0~100歳のラベル
const filteredLabels = filterLabelsEvenly(labels.slice(startAge), startAge);  // ラベルをフィルタリング

console.log(filteredLabels);

// // Y軸のラベルをフォーマットする関数
// const formatYAxisLabels = (value: number) => {
//   if (value >= 100000) {
//     return `${value / 10000}万`; // 10万以上
//   } else if (value >= 10000) {
//     return `${value / 1000}千`; // 1万以上
//   }
//   return `${value}円`; // 1万未満
// };

// チャートデータを作成
const chartData = {
  labels: filteredLabels, // 均等に間引いたラベルを使用
  datasets: [
    {
      data: assetTrendsData.datasets[0].data // 数値のまま保持
    }
  ]
};

// // データセットの型を定義
// interface Dataset {
//   data: number[];
//   color?: (opacity: number) => string;
// }

// // データポイントの型定義を追加
// interface DataPoint {
//   index: number;
//   value: number;
//   dataset: Dataset;
//   x: number;
//   y: number;
//   getColor: (opacity: number) => string;
// }

// const chartData = {
//   labels: filteredLabels, // 例: ["January", "February", ...] または ["1", "2", "3", ...]
//   datasets: [
//     {
//       label: 'Wallet (実績)',
//       data: [1000000, 1050000, 1100000, 1150000], // 財布の実績データ
//       color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`, // 実績データの色
//       strokeWidth: 2, // 線の太さ
//     },
//     {
//       label: 'Wallet (予測)',
//       data: [1020000, 1070000, 1120000, 1170000], // 財布の予測データ
//       color: (opacity = 1) => `rgba(63, 81, 181, ${opacity * 0.5})`, // 予測データの色（薄め）
//       strokeWidth: 2,
//     },
//     {
//       label: 'Bank Account (実績)',
//       data: [2000000, 2050000, 2100000, 2150000], // 銀行口座の実績データ
//       color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`, // 銀行口座実績データの色
//       strokeWidth: 2,
//     },
//     {
//       label: 'Bank Account (予測)',
//       data: [2020000, 2070000, 2120000, 2170000], // 銀行口座の予測データ
//       color: (opacity = 1) => `rgba(0, 150, 136, ${opacity * 0.5})`, // 予測データの色（薄め）
//       strokeWidth: 2,
//     }
//   ]
// };

  // テスト用のID
  // 実機テスト時に誤ってタップしたりすると、広告の配信停止をされたりするため、テスト時はこちらを設定する
  const unitId = TestIds.BANNER;

  // 実際に広告配信する際のID
  // 広告ユニット（バナー）を作成した際に表示されたものを設定する
  const adUnitID = Platform.select({
    ios: "ca-app-pub-2591881801621460/8428923504",
    android: "ca-app-pub-2591881801621460/6275471257",
    default: TestIds.BANNER, // デフォルト値としてテスト用のIDを設定
  });

  const handleReward = (reward:{ type: string; amount: number }) => {
    console.log("ユーザーに報酬を加算しました！", reward);
    // ここでポイント加算や他の処理を実施
  };

  const { loadRewarded } = rewardedAd(handleReward); // フックにコールバックを渡す

  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.mainContents}>
          <ScrollView style={styles.content}>
            <Text style={styles.contentTitle}>資産推移</Text>
            <View>
              <GAMBannerAd
                unitId={unitId}
                sizes={[BannerAdSize.ANCHORED_ADAPTIVE_BANNER]}
              />
            <Text onPress={loadRewarded}>リワード広告テスト</Text>
            </View>
            <LineChart
              data={chartData}
              width={screenWidth}
              height={208}
              yAxisLabel=""
              yAxisSuffix="円"
              yAxisInterval={1}  // Y軸の間隔
              fromZero={true}    // Y軸の最小値を0にする
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,  // 小数点以下を表示しない
                color: (opacity = 1) => `rgba(255, 195, 15, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#ffa726'
                },
                propsForLabels: {
                  fontSize: 10,  // フォントサイズを小さく設定
                },
              }}
              bezier
              onDataPointClick={(data: DataPoint) => {
                setSelectedData(data); // タップしたデータポイントの情報を設定
              }}
            />
            {selectedData && (
              <View
                style={{
                  position: 'absolute',
                  top: selectedData.y - 25,
                  left: selectedData.x - 40,

                  backgroundColor: '#ffffff',
                  borderColor: '#e26a00',
                  borderRadius: 5,
                  borderWidth: 1,
                  padding: 5,
                  elevation: 5,
                }}
              >
                <Text style={{
                  color: '#e26a00',
                }}>{`${selectedData.value.toLocaleString()}円`}</Text>
              </View>
            )}
          </ScrollView> 
        </View>
        <Footer />
      </View>
    </TouchableWithoutFeedback>
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
  innerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 320,
    height: 208,
    backgroundColor: '#ffffff'
  },
  assetSimulationBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#D9D9D9",
    width: 352,
    height: 240,
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
  row: {
    flexDirection: 'row',  // 子要素を横並びにする
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
})

export default DashBoard