import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { useAuth } from '../../hooks/auth';
import { getTableName } from '../../utils/storageTables';
import {
  Container,
  Header,
  HighlightCards,
  Icon,
  Loading,
  LoadingContainer,
  LogoutButton,
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

  const { signOut, user } = useAuth()

  async function loadTransactions() {
    const response = await AsyncStorage.getItem(
      getTableName('transactions', user.id)
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
            <Loading
              color={theme.colors.primary}
              size="large"
            />
          </LoadingContainer> :
          <>
            <Header>
              <UserWrapper>
                <UserInfo>
                  <Photo source={{ uri: user.photo }} />
                  <User>
                    <UserGreeting>Olá, </UserGreeting>
                    <UserName>{user.name}</UserName>
                  </User>
                </UserInfo>
                <LogoutButton onPress={signOut}>
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
                keyExtractor={(item: DataListProps) => item.id}
                renderItem={({ item }: { item: DataListProps }) => (
                  <TransactionCard data={item} />
                )}
              />
            </Transactions>
          </>
      }
    </Container>
  )
}