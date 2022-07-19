import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';
import { TRANSACTIONSKEY } from '../../utils/storageTables';
import { VictoryPie } from 'victory-native'
import { useTheme } from 'styled-components'

import { ChartContainer, Container, Content, Header, Title } from './styles';
import { RFValue } from 'react-native-responsive-fontsize';

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

  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

  async function loadData() {
    const response = await AsyncStorage.getItem(
      TRANSACTIONSKEY
    )

    const responseFormatted: TransactionData[] = response
      ? JSON.parse(response) : []

    const expensives = responseFormatted.filter(
      expensive => expensive.transactionType === 'negative'
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

  }

  useEffect(() => {
    loadData();
  }, [])

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>


      <Content>
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
    </Container>
  )
}