import React from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import {
  Container,
  Header,
  HighlightCards,
  Icon,
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

export function Dashboard() {

  const data: DataListProps[] = [
    {
      id: '1',
      title: "Desenvolvimento de site",
      amount: "R$ 12.000,00",
      date: "13/04/2020",
      type: 'positive',
      category: {
        name: "Venda",
        icon: "dollar-sign",
      }
    },
    {
      id: '2',
      title: "Uber Trip",
      amount: "R$ 49,00",
      date: "14/04/2020",
      type: 'negative',
      category: {
        name: "Carro",
        icon: "crosshair",
      }
    },
    {
      id: '3',
      title: "Aluguel do Apartamento",
      amount: "R$ 1.500,00",
      date: "16/04/2020",
      type: 'negative',
      category: {
        name: "Casa",
        icon: "home",
      }
    }
  ]

  return (
    <Container>
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
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
          type="up"
        />
        <HighlightCard
          title="Saídas"
          amount="R$ 1.259,00"
          lastTransaction="Última saída dia 03 de abril"
          type="down"
        />
        <HighlightCard
          title="Total"
          amount="R$ 16.141,00"
          lastTransaction="01 à 16 de abril"
          type="total"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>
        <TransactionsList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  )
}