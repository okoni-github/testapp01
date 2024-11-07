import { useEffect } from "react";
import {
  RewardedAdEventType,
  RewardedAd,
  TestIds,
} from "react-native-google-mobile-ads";

const useAdmob = () => {
  // テスト広告をリクエスト（本番では自身のadIDに書き換える）
  const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED);
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
    return () => {
      unsubscribeLoaded();
    };
  }, []);
  return { loadRewarded };
};

export default useAdmob;