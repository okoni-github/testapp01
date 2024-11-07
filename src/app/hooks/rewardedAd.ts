import { useEffect } from "react";
import { Platform } from "react-native";
import {
  RewardedAdEventType,
  RewardedAd,
  TestIds,
} from "react-native-google-mobile-ads";


const adUnitId = __DEV__
  ? TestIds.REWARDED  // 開発環境ではテストIDを使用
  : Platform.select({
      ios: "ca-app-pub-2591881801621460/8428923504",  // 本番環境のiOS用ID
      android: "ca-app-pub-2591881801621460/6275471257",  // 本番環境のAndroid用ID
    }) || "default-ad-unit-id"

const rewardedAd = (onRewardEarned?: (reward: { type: string; amount: number }) => void) => {
  // テスト広告をリクエスト（本番では自身のadIDに書き換える）
  const rewarded = RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });
  const loadRewarded = () => {
    rewarded.load();
  };

  useEffect(() => {
    // 広告のロード完了後、再生するように設定
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        rewarded.show();
      }
    );

    // 広告視聴後に特定の処理を実施
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("Reward received!", reward);
        // 引数で渡されたコールバックを呼び出す
        if (onRewardEarned) {
          onRewardEarned(reward);
        }
      }
    );

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };

  }, [onRewardEarned]);

  return { loadRewarded };
};

export default rewardedAd;