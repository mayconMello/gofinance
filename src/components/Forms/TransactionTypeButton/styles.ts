import Feather from '@expo/vector-icons/Feather';
import { TouchableOpacity } from "react-native";
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from "styled-components/native";

interface IconProps {
  type: 'up' | 'down';
}

interface ContainerProps extends IconProps {
  isActive: boolean;
}

export const Container = styled(TouchableOpacity) <ContainerProps>`
  width: 48%;

  flex-direction: row;
  align-items: center;
  justify-content: center;

  border-width: ${({ isActive, type }) => isActive ? 0 : 1.5}px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.text_light};
  border-radius: 5px;

  padding: 16px;

  ${({ isActive, type }) => isActive && type === 'up' && css`
    background-color: ${({ theme }) => theme.colors.success_light};
  `}

  ${({ isActive, type }) => isActive && type === 'down' && css`
    background-color: ${({ theme }) => theme.colors.attention_light}
  `}
`;

export const Title = styled.Text`
  font-size: ${RFValue(16)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;

export const Icon = styled(Feather) <IconProps>`
  font-size: ${RFValue(16)}px;

  margin-right: ${RFValue(12)}px;

  color: ${({ theme, type }) => type === 'up'
    ? theme.colors.success
    : theme.colors.attention
  }
`