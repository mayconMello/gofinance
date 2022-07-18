import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { TextInputProps } from 'react-native';
import { Input } from '../Forms/Input';

import { Container, Error } from './styles';
import { FormData } from '../../screens/Register'


interface Props extends TextInputProps {
  control: Control<FormData>;
  name: 'name' | 'amount';
  error?: FieldError
}

export function InputForm({ control, name, error, ...rest }: Props) {
  return (
    <Container>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            {...rest}
          />
        )}
        name={name}
      />
      {!!error && <Error>{error.message}</Error>}
    </Container >
  )
}