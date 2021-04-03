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
  'Fundo Imobiliário',
  'Caderneta de Poupança',
  'Títulos Públicos',
  'Certificados de Depósito Bancário (CDB)',
  'Letras de Crédito Imobiliário (LCI)',
  'Letras de Crédito do Agronegócio (LCA)',
  'Petróleo. Gás e Biocombustíveis',
  'Saúde',
  'Fundos de Renda Fixa.',
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
      console.log(`categoria ${nomeCategoria} cadastrado`);
    } else {
      console.log(`categoria ${nomeCategoria} já cadastrado`);
    }
  }
}

start();
