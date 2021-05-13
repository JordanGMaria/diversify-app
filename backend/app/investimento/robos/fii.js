const connection = require('../../../connection');
const Nightmare = require('nightmare');
const Model = require('../model');
const Setor = require('../../setor/model');
const Categoria = require('../../categoria/model');

const bot = Nightmare({
  show: true,
  webPreferences: {
    partition: 'persist: creci',
  },
});

const url = 'https://www.fundsexplorer.com.br/ranking';
const url2 = 'https://www.fundsexplorer.com.br/funds';

async function getNome() {
  const resp = await bot
    .goto(url2)
    .wait('#item-ARFI11B')
    .evaluate(async () => {
      let fii = [];
      const divs = document.getElementById('fiis-list-container');
      for (let i = 0; i < divs.children.length; i++) {
        const div = divs.children[i].children[0];
        const codigo = div.children[1].children[0].textContent;
        const nome = div.children[1].children[1].children[0].textContent;
        fii.push({nome, codigo});
      }
      return fii;
    })
    .end();
  for (let i = 0; i < resp.length; i++) {
    const fii = await Model.findOne({codigo: resp[i].codigo});
    console.log(fii);
    if (fii) {
      fii.nome = resp[i].nome;
      await fii.save();
    }
  }
}

async function salvarInvestimentos(fiis) {
  for (let i = 0; i < fiis.length; i++) {
    const fii = fiis[i];
    console.log(fii);
    let investimento = await Model.findOne({
      codigo: fii.codigo,
    });
    if (!investimento) {
      const categoria = await Categoria.findOne({nome: 'Fundos Imobiliário'});
      const setor = await Setor.findOne({nome: fii.setor});
      investimento = new Model({
        codigo: fii.codigo,
        categoria,
        setor,
      });
    }
    investimento.preco = fii.preco;
    await investimento.save();
  }
}

async function start() {
  const resp = await bot
    .goto(url)
    .wait('table')
    .evaluate(() => {
      let fii = [];
      const table = document.getElementsByTagName('table');
      const linhas = table[0].rows;
      for (let i = 2; i < linhas.length; i++) {
        const linha = linhas[i];
        const tds = linha.children;
        const codigo = tds[0].outerText;
        const setor = tds[1].outerText;
        const preco = parseFloat(
          tds[2].outerText.replace('R$', '').replace('N/A', '0')
        );
        fii.push({codigo, setor, preco});
      }
      return fii;
    })
    .end();
  await salvarInvestimentos(resp);
}

start();
//getNome();
