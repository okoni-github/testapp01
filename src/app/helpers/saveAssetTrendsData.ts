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

            for (let i = 0; i <= 100 - age; i++) {
              labels.push(`${i + age}歳`);
              dataPoints.push(asset);
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