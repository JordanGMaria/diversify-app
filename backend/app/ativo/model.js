const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  ativo: {
    type: Boolean,
    default: true,
  },
  nome: String,
  corretora: String,
  quantidade: Number,
  preco_medio: Number,
  nota: Number,
  categoria: {
    type: mongoose.Schema.ObjectId,
    ref: 'Categoria',
  },
  investimento: {
    type: mongoose.Schema.ObjectId,
    ref: 'Investimentos',
  },
  usuario: {
    type: mongoose.Schema.ObjectId,
    ref: 'Usuario',
  },
  dataCadastro: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Ativo', Schema);
