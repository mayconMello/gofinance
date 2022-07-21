import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMonths, format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { VictoryPie } from 'victory-native';
import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';
import { TRANSACTIONSKEY } from '../../utils/storageTables';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  ChartContainer,
  Container,
  Content,
  Header,
  LoadingContainer,
  Month,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Title
} from './styles';

interface TransactionData {
  transactionType: 'positive' | 'negative'
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  amount: string;
  amountNumber: number;
  color: string;
  percent: string;
}

export function Resume() {

  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

  function handleDateChange(action: 'prev' | 'next') {
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1))
    } else {
      setSelectedDate(subMonths(selectedDate, 1))
    }
  }

  async function loadData() {
    const response = await AsyncStorage.getItem(
      TRANSACTIONSKEY
    )

    const responseFormatted: TransactionData[] = response
      ? JSON.parse(response) : []

    const expensives = responseFormatted.filter(
      expensive => expensive.transactionType === 'negative' &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
    )

    const expensiveTotal = expensives
      .reduce((acc: number, expensive) => {
        return acc + Number(expensive.amount)
      }, 0)

    const totalByCategory: CategoryData[] = []

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach(expensive => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      })

      const amount = categorySum.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
      if (categorySum > 0) {

        const percent = (categorySum / expensiveTotal * 100).toFixed(0)
        totalByCategory.push({
          key: category.key,
          name: category.name,
          amount: amount,
          amountNumber: categorySum,
          color: category.color,
          percent: `${percent}%`
        })
      }
    })

    setTotalByCategories(totalByCategory)

    setIsLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate]))

  return (
    <Container>

      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      <MonthSelect>
        <MonthSelectButton onPress={() => handleDateChange('prev')}>
          <MonthSelectIcon name="chevron-left" />
        </MonthSelectButton>

        <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>

        <MonthSelectButton onPress={() => handleDateChange('next')}>
          <MonthSelectIcon name="chevron-right" />
        </MonthSelectButton>
      </MonthSelect>

      {
        isLoading ?
          <LoadingContainer>
            <ActivityIndicator
              color={theme.colors.primary}
              size="large"
            />
          </LoadingContainer> :
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight(),
            }}
          >
            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                colorScale={totalByCategories.map(
                  category => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: theme.colors.shape
                  }
                }}
                labelRadius={50}
                x='percent'
                y='amountNumber'
              />

            </ChartContainer>
            {totalByCategories.map(item => (
              <HistoryCard
                title={item.name}
                amount={item.amount}
                color={item.color}
                key={item.key}
              />
            ))}
          </Content>
      }
    </Container>
  )
}