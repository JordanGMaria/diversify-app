import React, {useRef, useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import Input from '../../components/Input';
import InputMask from '../../components/InputMask';
import {Form} from '@unform/mobile';
import {
  Button,
  TextButton,
  Label,
  PageForm,
  KeyboardAvoidingView,
} from '../../components/styles';
import Toast from 'react-native-simple-toast';
import Select from 'react-native-select-two';
import wait from '../../core/wait';
import * as Yup from 'yup';
import api from '../../services/api';

export default function AddEditAtivo({route, navigation}) {
  const formRef = useRef(null);
  const [categorias, setcategorias] = useState([]);
  const [categoria, setcategoria] = useState(null);
  const [investimentos, setinvestimentos] = useState([]);
  const [investimento, setinvestimento] = useState(null);

  async function handleSubmit(data) {
    try {
      const schema = Yup.object().shape({
        preco_medio: Yup.string().required('Preço Médio é obrigatório'),
        quantidade: Yup.string().required('Quantidade é obrigatório'),
        nota: Yup.string().required('Nota é obrigatório'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      if(!investimento) Toast.show('Selecione um ativo', Toast.LONG);
      if(!categoria) Toast.show('Selecione uma categoria', Toast.LONG);

      data.investimento = investimento;
      data.categoria = categoria;

      let response;
      if (route.params && route.params.ativo) {
        const ativo = route.params.ativo;

        data._id = ativo._id;

        response = await api.put('/jwt/ativo', data);
      } else {
        response = await api.post('/jwt/ativo', data);
      }

      if (!response.data.success) {
        Toast.show(response.data.err, Toast.LONG);
        return;
      }

      Toast.show('Ativo Salvo com sucesso 🚀');

      await wait(1000);

      navigation.push('Home');
    } catch (err) {
      console.log('err', err);
      const validationErrors = {};
      if (err instanceof Yup.ValidationError) {
        Toast.show('Verifique os dados', Toast.LONG);
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        formRef.current.setErrors(validationErrors);
      }
    }
  }

  async function fetchData() {
    const responseCategorias = await api.post('/jwt/categoria/list', {
      all: true,
    });
    responseCategorias.data.data.map((el, i) => {
      el.id = el._id;
      el.name = el.nome;
      return el;
    });
    setcategorias(responseCategorias.data.data);
    const ativo = route.params?.ativo;
    if (ativo && formRef.current) {
      formRef.current.setData(ativo);
    }
  }

  async function getInvestimentos() {
    const response = await api.post('/jwt/investimento/list', {
      all: true,
      categoria,
    });
    response.data.data.map((el, i) => {
      el.id = el._id;
      el.name = el.codigo;
      return el;
    });
    setinvestimentos(response.data.data);
  }

  useEffect(() => {
    fetchData();
  }, [route.params]);

  useEffect(() => {
    if (categoria) getInvestimentos();
  }, [categoria]);

  return (
    <PageForm>
      <KeyboardAvoidingView>
        <StatusBar barStyle="light-content" backgroundColor="#202547" />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Label>Categoria Investimento</Label>
          <View style={{marginRight: 10, marginLeft: 10}}>
            <Select
              isSelectSingle
              colorTheme="#202547"
              popupTitle="Selecionar Categoria"
              title="Selecionar Categoria"
              searchPlaceHolderText="Selecionar Categoria"
              cancelButtonText="Cancelar"
              selectButtonText="Selecionar"
              style={style.select}
              data={categorias}
              onSelect={(data) => {
                setcategoria(data[0]);
              }}
            />
          </View>
          {categoria && (
            <>
              <Label>Ativo Investimento (SIGLA)</Label>
              <View style={{marginRight: 10, marginLeft: 10}}>
                <Select
                  isSelectSingle
                  colorTheme="#202547"
                  popupTitle="Selecionar Ativo"
                  title="Selecionar Ativo"
                  searchPlaceHolderText="Selecionar Ativo"
                  cancelButtonText="Cancelar"
                  selectButtonText="Selecionar"
                  style={style.select}
                  data={investimentos}
                  onSelect={(data) => {
                    setinvestimento(data[0]);
                  }}
                />
              </View>
              {investimento && (
                <>
                  <Label>Corretora</Label>
                  <Input
                    name="corretora"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Exemplo CLEAR"
                  />
                  <Label>Preço Médio do Ativo</Label>
                  <InputMask
                    name="preco_medio"
                    type={'money'}
                    options={{
                      precision: 2,
                      separator: ',',
                      delimiter: '.',
                      unit: 'R$',
                      suffixUnit: '',
                    }}
                    keyboardType={'numeric'}
                    placeholder="Preço Médio"
                  />
                  <Label>Quantidade</Label>
                  <Input
                    name="quantidade"
                    keyboardType={'numeric'}
                    placeholder="Quantidade"
                  />
                  <Label>Nota</Label>
                  <Input
                    name="nota"
                    keyboardType={'numeric'}
                    placeholder="Exemplo 10"
                  />
                  <Button onPress={() => formRef.current.submitForm()}>
                    <TextButton color="#ebeaea">Salvar</TextButton>
                  </Button>
                </>
              )}
            </>
          )}
        </Form>
      </KeyboardAvoidingView>
    </PageForm>
  );
}

const style = StyleSheet.create({
  select: {
    fontFamily: 'Poppins-Regular',
    height: 46,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomColor: '#202547',
    paddingLeft: 15,
    color: '#202547',
    marginTop: 10,
    marginBottom: 10,
  },
});
