import { db } from '@/src/config';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

import { AssetTrendsData } from '@/types/AssetTrendsData';
import { User } from 'firebase/auth';

const saveAssetTrendsData = (authUser: User) => {
  if (!authUser) {
    console.error('authUser が null です');
    return;
  }

  // ageを取得
  const ageRef = doc(db, `users/${authUser.uid}/age`, 'ageId');
  getDoc(ageRef)
    .then((ageDoc) => {
      if (!ageDoc.exists()) {
        console.error('Age ドキュメントが見つかりません');
        return;
      }
      const age = ageDoc.data()?.age;

      // assetAmountを取得
      const assetAmountRef = doc(db, `users/${authUser.uid}/assetAmount`, 'assetAmountId');
      return getDoc(assetAmountRef).then((assetAmountDoc) => {
        if (!assetAmountDoc.exists()) {
          console.error('AssetAmount ドキュメントが見つかりません');
          return;
        }
        const assetAmount = assetAmountDoc.data()?.assetAmount;

        // incomeForecastを取得
        const incomeForecastRef = doc(db, `users/${authUser.uid}/incomeForecast`, 'incomeForecastId');
        return getDoc(incomeForecastRef).then((incomeForecastDoc) => {
          if (!incomeForecastDoc.exists()) {
            console.error('IncomeForecast ドキュメントが見つかりません');
            return;
          }
          const incomeForecast = incomeForecastDoc.data()?.incomeForecast;

          // expendituresForecastを取得
          const expendituresForecastRef = doc(db, `users/${authUser.uid}/expendituresForecast`, 'expendituresForecastId');
          return getDoc(expendituresForecastRef).then((expendituresForecastDoc) => {
            if (!expendituresForecastDoc.exists()) {
              console.error('ExpendituresForecast ドキュメントが見つかりません');
              return;
            }
            const expendituresForecast = expendituresForecastDoc.data()?.expendituresForecast;

            // すべてのデータを取得後、資産推移データを計算
            const monthlyNetIncrease = incomeForecast - expendituresForecast;
            let asset = assetAmount;
            const labels: string[] = [];
            const dataPoints: number[] = [];

            // 年齢データ（例: 32歳6ヶ月であれば ageYears = 32, ageMonths = 6）
            const ageYears = 32;  // 現在の年齢（年）
            const ageMonths = 6;  // 現在の年齢（月）
            
            // 現在の年齢から100歳0ヶ月までデータを作成
            for (let i = ageYears * 12 + ageMonths; i <= 100 * 12; i++) {
              // 年と月を計算
              const years = Math.floor(i / 12);
              const months = i % 12;
              
              // ラベルを追加 (例: 32歳6ヶ月, 100歳0ヶ月)
              labels.push(`${years}歳${months}ヶ月`);
              
              // 資産データを追加
              dataPoints.push(asset);
              
              // 月毎の増加分を資産に追加
              asset += monthlyNetIncrease;
            }

            const remoteAssetTrendsData: AssetTrendsData = {
              labels: labels,
              datasets: [{ data: dataPoints }]
            };

            // Firestoreへ保存
            const assetTrendsDataRef = doc(db, `users/${authUser.uid}/assetTrendsData`, 'assetTrendsDataId');
            setDoc(assetTrendsDataRef, {
              labels: remoteAssetTrendsData.labels,
              datasets: remoteAssetTrendsData.datasets.map((dataset) => ({
                data: dataset.data
              })),
              updatedAt: Timestamp.fromDate(new Date())
            })
              .then(() => {
                console.log('資産推移データが正常に保存されました');
              })
              .catch((error) => {
                console.error('資産推移データの保存に失敗しました:', error);
              });
          });
        });
      });
    })
    .catch((error) => {
      console.error('データの取得に失敗しました:', error);
    });
};

export default saveAssetTrendsData