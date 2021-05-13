const connection = require('../../connection');
const {CronJob} = require('cron');
const Investimento = require('../../app/investimento/model');
const axios = require('axios');
const config = require('../../config');
const {IncomingWebhook} = require('@slack/webhook');
const webhook = new IncomingWebhook(config.slack_webhook);

function stringify(obj) {
  return JSON.stringify(obj);
}

async function sendError(error, body, namefunction) {
  let msg = '> _AVISOS DIVERSIFY APP\n';
  msg += `*FUNÇÃO*: ${namefunction} \n`;
  msg += `*BODY*: ${stringify(body)} \n`;
  msg += `*ERRO*: ${error} \n`;

  await webhook.send({
    text: msg,
  });
}

async function getCotacoes() {
  const investimentos = await Investimento.find({});
  try {
    for (let i = 0; i < investimentos.length; i++) {
      const investimento = investimentos[i];
      const response = await axios.get(
        `https://api.hgbrasil.com/finance/stock_price?key=${config.chavehg}&symbol=${investimento.codigo}`
      );
      if (response.data.results) {
        if (Object.values(response.data.results)[0].price) {
          console.log(investimento, Object.values(response.data.results)[0]);
          investimento.ultimo_update = Object.values(
            response.data.results
          )[0].updated_at;
          investimento.preco = parseFloat(
            Object.values(response.data.results)[0].price
          );
          await investimento.save();
        }
      }
    }
  } catch (error) {
    await sendError(error, error.response.data, 'CRON COTAÇÃO');
  }
  console.log('Finalizado');
}

function start() {
  const job = new CronJob({
    cronTime: '0 18 * * *',
    onTick: async () => {
      console.log('Iniciando busca por cotação');
      await getCotacoes();
    },
    start: false,
  });

  console.log('Cron cotação iniciado');
  job.start();
}

start();
//getCotacoes();
