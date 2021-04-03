const Model = require('./../model');
const config = require('../../../config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true,
});

const setores = [
  'Bens Industriais',
  'Comunicações',
  'Consumo Cíclico',
  'Consumo não Cíclico',
  'Financeiro',
  'Materiais Básicos',
  'Petróleo. Gás e Biocombustíveis',
  'Saúde',
  'Tecnologia da Informação',
  'Utilidade Pública',
  'Outros',
];

async function start() {
  console.log('Cadastrando setores');
  for (let i = 0; i < setores.length; i++) {
    const nomeSetor = setores[i];
    let setor = await Model.findOne({ativo:true,nome: nomeSetor});
    if (!setor) {
      setor = new Model({nome: nomeSetor});
      await setor.save();
      console.log(`setor ${nomeSetor} cadastrado`);
    } else {
      console.log(`setor ${nomeSetor} já cadastrado`);
    }
  }
}

start();
