const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  ativo: {
    type: Boolean,
    default: true,
  },
  nome: String,
});

module.exports = mongoose.model('Categoria', Schema);
