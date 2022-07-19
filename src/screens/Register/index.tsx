import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Keyboard,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import uuid from 'react-native-uuid';
import * as Yup from 'yup';
import { Button } from '../../components/Forms/Button';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { InputForm } from '../../components/InputForm';

import { CategorySelect } from '../CategorySelect';

import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppRoutesParamList } from '../../routes/app.routes';
import { TRANSACTIONSKEY } from '../../utils/storageTables';
import {
  Container, Fields, Form, Header,
  Title,
  TransactionsType
} from './styles';

export interface FormData {
  name: string;
  amount: string;
}


const shema = Yup.object().shape({
  name: Yup
    .string()
    .required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError('Informe um valor númerico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório')
})

type RegisterNaviationProps = BottomTabNavigationProp<AppRoutesParamList>

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const navagation = useNavigation<RegisterNaviationProps>();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(shema)
  })

  function handleTransactionsTypeSelected(type: 'positive' | 'negative') {
    setTransactionType(type);
  }

  function handleCloseSelectCategory() {
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategory() {
    setCategoryModalOpen(true);
  }

  function handleResetForm() {
    reset();
    setTransactionType('');
    setCategory({
      key: 'category',
      name: 'Categoria',
    });
  }

  async function handleRegister(form: Partial<FormData>) {
    if (!transactionType) {
      return Alert.alert(
        'Selecione o tipo da transação'
      )
    }

    if (category.key === 'category') {
      return Alert.alert(
        'Selecione a categoria'
      )
    }


    const newTransaction = {
      id: String(uuid.v4()),
      transactionType,
      category: category.key,
      date: new Date(),
      ...form,
    }

    try {

      const data = await AsyncStorage.getItem(
        TRANSACTIONSKEY
      )

      const currentData = data ? JSON.parse(data) : []

      await AsyncStorage.setItem(
        TRANSACTIONSKEY,
        JSON.stringify([
          ...currentData,
          newTransaction
        ])
      );

      handleResetForm();

      navagation.navigate('Listagem');

    } catch (error) {
      console.log(error)
      Alert.alert(
        'Não foi possível salvar o registro!'
      )
    }
  }

  useEffect(() => {
    async function loadData() {
      const data = await AsyncStorage.getItem(
        TRANSACTIONSKEY
      )

      console.log(JSON.parse(data!))
    }
    loadData();
    // async function removeAll() {
    //   await AsyncStorage.removeItem(TRANSACTIONSKEY)
    // }
    // removeAll()
  }, [])

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name}
            />

            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount}
            />

            <TransactionsType>
              <TransactionTypeButton
                title="Inbound"
                type="positive"
                onPress={() => handleTransactionsTypeSelected('positive')}
                isActive={transactionType === 'positive'}
              />
              <TransactionTypeButton
                title="Outcome"
                type="negative"
                onPress={() => handleTransactionsTypeSelected('negative')}
                isActive={transactionType == 'negative'}
              />
            </TransactionsType>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategory}
            />
          </Fields>

          <Button
            title="Enviar"
            onPress={handleSubmit(handleRegister)}

          />
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
    </TouchableWithoutFeedback>
  )
}