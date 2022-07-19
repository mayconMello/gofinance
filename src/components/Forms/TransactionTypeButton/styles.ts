import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from "styled-components/native";

interface IconProps extends RectButtonProps {
  type: 'positive' | 'negative';
};

interface ContainerProps extends IconProps {
  isActive: boolean;
  children: React.ReactNode;
};

export const Container = styled.View<ContainerProps>`
  width: 48%;

  border-width: ${({ isActive }) => isActive ? 0 : 1.5}px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.text_light};
  border-radius: 5px;

  ${({ isActive, type }) => isActive && type === 'positive' && css`
    background-color: ${({ theme }) => theme.colors.success_light};
  `};

  ${({ isActive, type }) => isActive && type === 'negative' && css`
    background-color: ${({ theme }) => theme.colors.attention_light};
  `};
`;

export const Title = styled.Text`
  font-size: ${RFValue(16)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;

export const Button = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  
  padding: 16px;
`

export const Icon = styled(Feather) <IconProps>`
  font-size: ${RFValue(16)}px;

  margin-right: ${RFValue(12)}px;

  color: ${({ theme, type }) => type === 'positive'
    ? theme.colors.success
    : theme.colors.attention
  };
`