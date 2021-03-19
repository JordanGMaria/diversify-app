import React from 'react';
import {StatusBar} from 'react-native';
import {
  PageAuth,
  Area1,
  Area2,
  TextBig,
  TextBigSubtitulo,
  Logo,
  ButtonInicial,
  ButtonInicialColor,
  TextButtonInicial,
} from '../../../components/styles';
import logo from '../../../../assets/Logo/Logo.png';

export default function Inicial({navigation}) {
  return (
    <PageAuth color="#202547">
      <StatusBar barStyle="light-content" backgroundColor="#2a356a" />
      <Area1>
        <TextBigSubtitulo>Bem vindo</TextBigSubtitulo>
        <Logo source={logo}/>
        <TextBig>Gestão de Aportes</TextBig>
      </Area1>
      <Area2>
        <ButtonInicial onPress={() => navigation.navigate('Registrar')}>
          <TextButtonInicial>Cadastrar-se</TextButtonInicial>
        </ButtonInicial>
        <ButtonInicialColor onPress={() => navigation.navigate('Login')}>
          <TextButtonInicial>Entrar</TextButtonInicial>
        </ButtonInicialColor>
      </Area2>
    </PageAuth>
  );
}
