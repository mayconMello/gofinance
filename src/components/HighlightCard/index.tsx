import React from "react";

import {
  Amount,
  Container,
  Footer,
  Header,
  Icon,
  LastTransaction,
  Title
} from "./styles";

interface Props {
  title: string;
  amount: string | undefined;
  lastTransaction: string | undefined;
  lastTransactionMessage?: string;
  type: 'up' | 'down' | 'total';
}

const icon = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
  total: 'dollar-sign'
}

export function HighlightCard({
  title, amount, lastTransaction, lastTransactionMessage, type
}: Props) {
  return (
    <Container type={type}>
      <Header>
        <Title type={type}>{title}</Title>
        <Icon name={icon[type]} type={type}></Icon>
      </Header>

      <Footer>
        <Amount type={type}>{amount}</Amount>
        <LastTransaction type={type}>
          {lastTransactionMessage && lastTransactionMessage} {lastTransaction}
        </LastTransaction>
      </Footer>

    </Container>
  )
}