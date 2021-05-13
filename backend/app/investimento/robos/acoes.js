const connection = require('../../../connection');
const Nightmare = require('nightmare');
const Model = require('../model');
const Categoria = require('../../categoria/model');

const bot = Nightmare({
  show: true,
  webPreferences: {
    partition: 'persist: creci',
  },
});

const url = 'http://www.grafbolsa.com/';

async function salvarInvestimentos(acoes) {
  for (let i = 0; i < acoes.length; i++) {
    const acao = acoes[i];
    console.log(acao);
    let investimento = await Model.findOne({
      nome: acao.nome,
      codigo: acao.codigo,
    });
    if (!investimento) {
      const categoria = await Categoria.findOne({nome: 'Ações'});
      investimento = new Model({
        nome: acao.nome,
        codigo: acao.codigo,
        categoria,
      });
    }
    investimento.preco = acao.cotacao;
    await investimento.save();
  }
}

async function start() {
  const resp = await bot
    .goto(url)
    .wait('table')
    .evaluate(() => {
      const table = document.getElementsByTagName('table');
      const linhas = table[1].rows;
      let acao = [];
      for (let i = 3; i < linhas.length; i++) {
        const linha = linhas[i];
        const tds = linha.children;
        const nome = tds[0].children[0].children[0].textContent
          .replace('      ', ' ')
          .replace('         ', ' ')
          .replace('     ', ' ')
          .replace('      ', ' ')
          .replace('    ', ' ')
          .replace('   ', ' ')
          .replace('   ', ' ')
          .replace('  ', ' ');
        const codigo = tds[9].children[0].textContent;
        const cotacao = parseFloat(tds[1].children[0].textContent);
        acao.push({nome, codigo, cotacao});
      }
      return acao;
    })
    .end();
  if (resp) salvarInvestimentos(resp);
}

start();
