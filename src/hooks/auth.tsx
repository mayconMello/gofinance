import React, { createContext, useContext, useState, useEffect } from "react";

import * as AuthSession from 'expo-auth-session';
import { authUrl, uriProfile } from "../utils/configs.google";
import { USERKEY } from "../utils/storageTables";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthContextData {
  user: UserData;
  userStorageLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  },
  type: string;
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {

  const [user, setUser] = useState<UserData>({} as UserData);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  async function signInWithGoogle() {
    try {
      const { params, type } = await AuthSession.startAsync(
        { authUrl }
      ) as AuthorizationResponse;

      if (type === 'success') {
        const response = await fetch(
          uriProfile(params.access_token)
        );
        const userLogged = await response.json();

        setUser({
          id: userLogged.id,
          email: userLogged.email,
          name: userLogged.given_name,
          photo: userLogged.picture
        });

        await AsyncStorage.setItem(
          USERKEY,
          JSON.stringify(userLogged)
        )
      }

    } catch (error) {
      throw new Error(error as string);
    }
  }

  async function signOut() {
    setUser({} as UserData);

    await AsyncStorage.removeItem(
      USERKEY
    )
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userStoraged = await AsyncStorage.getItem(
        USERKEY
      )
      if (userStoraged) {
        const userLogged = JSON.parse(userStoraged) as UserData;

        setUser(userLogged)
        setUserStorageLoading(false)
      }
    }
    loadUserStorageData();
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      userStorageLoading,
      signInWithGoogle,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context
}

export { AuthProvider, useAuth }