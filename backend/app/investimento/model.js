const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  ativo: {
    type: Boolean,
    default: true,
  },
  nome: String,
  codigo: String,
  preco: Number,
  ultimo_update: String,
  categoria: {
    type: mongoose.Schema.ObjectId,
    ref: "Categoria",
  },
  setor: {
    type: mongoose.Schema.ObjectId,
    ref: "Setor",
  },
});

module.exports = mongoose.model('Investimentos', Schema);
