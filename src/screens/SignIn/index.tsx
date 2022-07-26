import React from "react";
import { Alert } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from 'styled-components';

import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { SignInSocialButton } from "../../components/SignInSocialButton";
import { useAuth } from "../../hooks/auth";

import {
  Container,
  Footer,
  FooterWrapper,
  Header,
  Loading,
  SignInTitle,
  Title,
  TitleWrapper
} from './styles';

export function SignIn() {

  const { signInWithGoogle, setUserStorageLoading, userStorageLoading } = useAuth()

  const theme = useTheme();


  async function handleSignInWithGoogle() {
    try {
      setUserStorageLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.log(error)
      Alert.alert('Não foi possível conectar a conta Google!')
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />
        </TitleWrapper>

        <Title>
          Controle suas {'\n'}
          finanças de forma {'\n'}
          muito simples
        </Title>

        <SignInTitle>
          Faça seu login com {'\n'}
          uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
        </FooterWrapper>

        {userStorageLoading &&
          <Loading
            color={theme.colors.shape}
            style={{ marginTop: 18 }}
          />
        }
      </Footer>
    </Container>
  )
}