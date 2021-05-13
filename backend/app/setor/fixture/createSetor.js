const Model = require('./../model');
const config = require('../../../config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true,
});

const setoresAcao = [
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

const setoresFII = [
  'Hospital',
  'Hotel',
  'Híbrido',
  'Lajes Corporativas',
  'Logística',
  'Residencial',
  'Shoppings',
  'Títulos e Val. Mob.',
  'Outros'
];

async function start() {
  console.log('Cadastrando setores');
  for (let i = 0; i < setoresAcao.length; i++) {
    const nomeSetor = setoresAcao[i];
    let setor = await Model.findOne({ativo: true, nome: nomeSetor, acao: true});
    if (!setor) {
      setor = new Model({nome: nomeSetor, acao: true});
      await setor.save();
      console.log(`setor ${nomeSetor} cadastrado`);
    } else {
      console.log(`setor ${nomeSetor} já cadastrado`);
    }
  }
  for (let i = 0; i < setoresFII.length; i++) {
    const nomeSetor = setoresFII[i];
    let setor = await Model.findOne({ativo: true, nome: nomeSetor, fii: true});
    if (!setor) {
      setor = new Model({nome: nomeSetor, fii: true});
      await setor.save();
      console.log(`setor ${nomeSetor} cadastrado`);
    } else {
      console.log(`setor ${nomeSetor} já cadastrado`);
    }
  }
}

start();
