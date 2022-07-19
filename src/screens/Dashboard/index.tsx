import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { TRANSACTIONSKEY } from '../../utils/storageTables';
import { useTheme } from 'styled-components'
import {
  Container,
  Header,
  HighlightCards,
  Icon,
  LogoutButton,
  LoadingContainer,
  Photo,
  Title,
  Transactions,
  TransactionsList,
  User,
  UserGreeting,
  UserInfo,
  UserName,
  UserWrapper
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

const getLastTransactions = (
  type: 'positive' | 'negative',
  transactions: DataListProps[]
) => {
  return new Date(
    Math.max.apply(
      Math, transactions
        .filter(transaction =>
          transaction.transactionType === type
        )
        .map(transaction =>
          new Date(transaction.date).getTime()
        )
    )
  ).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
  })
}

export function Dashboard() {

  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>()
  const theme = useTheme();

  async function loadTransactions() {
    const response = await AsyncStorage.getItem(
      TRANSACTIONSKEY
    )

    const transactions = response ? JSON.parse(response) : []

    let entriesSum = 0;
    let expensiveSum = 0
    let total = 0;

    const transactionFormated: DataListProps[] = transactions
      .map((transaction: DataListProps) => {

        if (transaction.transactionType === 'positive') {
          entriesSum += Number(transaction.amount);
        } else {
          expensiveSum += Number(transaction.amount);
        }

        total = entriesSum - expensiveSum;

        const amount = Number(
          transaction.amount
        ).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(transaction.date))

        return {
          ...transaction,
          date,
          amount,
        }
      })

    setHighlightData({
      entries: {
        amount: entriesSum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: getLastTransactions(
          'positive',
          transactions
        )
      },
      expensives: {
        amount: expensiveSum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: getLastTransactions(
          'negative',
          transactions
        )
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: ''
      }
    })
    setTransactions(transactionFormated);

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, [])

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []))

  return (
    <Container>
      {
        isLoading ?
          <LoadingContainer>
            <ActivityIndicator
              color={theme.colors.primary}
              size="large"
            />
          </LoadingContainer> :
          <>
            <Header>
              <UserWrapper>
                <UserInfo>
                  <Photo source={{ uri: 'https://github.com/mayconMello.png' }} />
                  <User>
                    <UserGreeting>Olá, </UserGreeting>
                    <UserName>Maycon</UserName>
                  </User>
                </UserInfo>
                <LogoutButton onPress={() => { }}>
                  <Icon name="power" />
                </LogoutButton>
              </UserWrapper>
            </Header>

            <HighlightCards>
              <HighlightCard
                title="Entradas"
                amount={highlightData?.entries.amount}
                lastTransaction={highlightData?.entries.lastTransaction}
                lastTransactionMessage='Ultima entrada dia '
                type="up"
              />
              <HighlightCard
                title="Saídas"
                amount={highlightData?.expensives.amount}
                lastTransaction={highlightData?.expensives.lastTransaction}
                lastTransactionMessage="Última saída dia"
                type="down"
              />
              <HighlightCard
                title="Total"
                amount={highlightData?.total.amount}
                lastTransaction={highlightData?.expensives.lastTransaction}
                lastTransactionMessage="01 à"
                type="total"
              />
            </HighlightCards>

            <Transactions>
              <Title>Listagem</Title>
              <TransactionsList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
              />
            </Transactions>
          </>
      }
    </Container>
  )
}