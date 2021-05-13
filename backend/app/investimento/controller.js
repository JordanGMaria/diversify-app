const Model = require('./model');
const mongoose = require('mongoose');
const config = require('../../config');
const {IncomingWebhook} = require('@slack/webhook');

const webhook = new IncomingWebhook(config.slack_webhook);

function stringify(obj) {
  return JSON.stringify(obj);
}

async function sendError(error, body, namefunction, res) {
  let msg = '> _AVISOS DIVERSIFY APP\n';
  msg += `*FUNÇÃO*: ${namefunction} \n`;
  msg += `*BODY*: ${stringify(body)} \n`;
  msg += `*ERRO*: ${error} \n`;

  await webhook.send({
    text: msg,
  });

  res.json({
    success: false,
    err: 'OPS!!! Algum erro ocorreu',
    form: body,
  });
}

exports.index = async (req, res) => {
  try {
    const filtro = {
      ativo: true,
    };

    if (req.body.categoria) {
      filtro.categoria = req.body.categoria;
    }

    let query = Model.find(filtro);

    if (!req.body.all) {
      query.skip(req.body.skip || 0);
      query.limit(req.body.limit || 5);
    }

    let data = await query.exec();

    const total = await Model.find(filtro).count();

    res.json({
      total,
      data,
    });
  } catch (error) {
    await sendError(error, req.body, 'LIST INVESTIMENTOS', res);
  }
};

exports.get = async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);

    if (data) {
      res.json({
        data,
      });
    } else {
      res.json({
        success: false,
        err: 'OPS!!! Algum erro ocorreu',
        form: req.body,
      });
    }
  } catch (error) {
    await sendError(error, req.body, 'GET INVESTIMENTO', res);
  }
};

exports.new = async (req, res) => {
  try {
    var model = new Model(req.body);

    const data = await model.save();

    if (data) {
      res.json({
        success: true,
        data,
        form: req.body,
        res: 'Criado com sucesso.',
      });
    } else {
      res.json({
        success: false,
        data,
        err: 'OPS!!! Some error has ocurred',
        res: 'Erro ao salvar aluno.',
        form: req.body,
      });
    }
  } catch (error) {
    await sendError(error, req.body, 'NOVO INVESTIMENTO', res);
  }
};

exports.delete = async (req, res) => {
  try {
    const ativo = await Model.findById(req.params.id);
    ativo.ativo = false;

    const data = await ativo.save();

    if (data) {
      res.json({
        success: true,
      });
    } else {
      res.json({
        success: false,
        err: 'An error has occured',
      });
    }
  } catch (error) {
    await sendError(error, req.body, 'REMOVE INVESTIMENTO', res);
  }
};

exports.edit = async (req, res) => {
  try {
    const model = await Model.findById(req.body._id);

    for (key in req.body) {
      model[key] = req.body[key];
    }

    const data = await model.save();

    if (data) {
      res.json({
        success: true,
        data,
        form: req.body,
        res: 'Atualizado com sucesso.',
      });
    } else {
      res.json({
        success: false,
        data,
        err: 'Erro ao tentar salvar',
        form: req.body,
        res: 'Erro ao atualizar.',
      });
    }
  } catch (error) {
    await sendError(error, req.body, 'EDITAR INVESTIMENTO', res);
  }
};
