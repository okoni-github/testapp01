import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Redirect, router } from "expo-router";
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

import { auth, db } from '../config';
import { doc, getDoc } from 'firebase/firestore';
import { ActivityIndicator, View } from 'react-native';

const Index = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true); // ローディング状態
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // router.replace('/Dashboard/DashBoard');
        // const userDocRef = doc(db, 'users', user.uid);
        if (auth.currentUser === null) { return }
        const isRegisteredRef = doc(db, `users/${auth.currentUser.uid}/isRegistered`, 'isRegisteredId');
        
        getDoc(isRegisteredRef)
          .then((userDocSnap) => {
            if (userDocSnap.exists() && userDocSnap.data()?.isRegistered) {
              // isRegistered が true の場合
              router.replace('/Dashboard/DashBoard');
            } else {
              // isRegistered が false またはフィールドが存在しない場合
              router.replace('/UserRegistration/UserRegistration');
            }
          })
          .catch((error) => {
            console.error("Error checking registration status:", error);
          })
          .finally(() => {
            setIsLoading(false); // 判定が終わったらローディング終了
          });
      } else {
        setIsLoading(false); // ユーザーがいない場合もローディング終了
      }
    });
  }, []);

  // ローディング中はインジケーターを表示
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFC30F" />
      </View>
    );
  }

  return <Redirect href='/auth/log_in' />
}

export default Index