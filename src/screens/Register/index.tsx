import React, { useState } from 'react';
import { Modal } from 'react-native';
import { Button } from '../../components/Forms/Button';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import { Input } from '../../components/Forms/Input';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';

import { CategorySelect } from '../CategorySelect'

import {
  Container, Fields, Form, Header,
  Title,
  TransactionsType
} from './styles';

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  function handleTransactionsTypeSelected(type: 'up' | 'down') {
    setTransactionType(type);
  }

  function handleCloseSelectCategory() {
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategory() {
    setCategoryModalOpen(true);
  }

  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <Input placeholder="Nome" />

          <Input placeholder="Preço" />

          <TransactionsType>
            <TransactionTypeButton
              title="Inbound"
              type="up"
              onPress={() => handleTransactionsTypeSelected('up')}
              isActive={transactionType === 'up'}
            />
            <TransactionTypeButton
              title="Outcome"
              type="down"
              onPress={() => handleTransactionsTypeSelected('down')}
              isActive={transactionType == 'down'}
            />
          </TransactionsType>

          <CategorySelectButton
            title={category.name}
            onPress={handleOpenSelectCategory}
          />
        </Fields>

        <Button title="Enviar" />
      </Form>

      <Modal
        visible={categoryModalOpen}
      >
        <CategorySelect
          category={category}
          setCategory={setCategory}
          closeSelectedCategory={handleCloseSelectCategory}
        />
      </Modal>
    </Container>
  )
}