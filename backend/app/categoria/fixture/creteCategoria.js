const Model = require('../model');
const config = require('../../../config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true,
});

const categorias = [
  'Ações',
  'BDR',
  'Stocks',
  'Fundos Imobiliário',
  'Reits',
  'Criptomoeda',
  'Debêntures',
  'Fundos',
  'Renda Fixa Pós-fixada',
  'Renda Fixa Prefixada',
  'Poupança',
  'Outros',
];

async function start() {
  console.log('Cadastrando categorias');
  for (let i = 0; i < categorias.length; i++) {
    const nomeCategoria = categorias[i];
    let categoria = await Model.findOne({ativo:true, nome: nomeCategoria});
    if (!categoria) {
      categoria = new Model({nome: nomeCategoria});
      await categoria.save();
      console.log(`Categoria ${nomeCategoria} cadastrado`);
    } else {
      console.log(`Categoria ${nomeCategoria} já cadastrado`);
    }
  }
}

start();
