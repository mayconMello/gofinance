import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from 'styled-components';

import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import theme from './src/global/styles/theme';

import { StatusBar } from 'expo-status-bar';
import { Routes } from './src/routes';

import { LogBox } from 'react-native';

import { AuthProvider, useAuth } from './src/hooks/auth';

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { userStorageLoading } = useAuth();

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          Poppins_400Regular,
          Poppins_500Medium,
          Poppins_700Bold
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady || userStorageLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
      onLayout={onLayoutRootView}
    >
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Routes />
        </AuthProvider>
        <StatusBar style="light" />
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}