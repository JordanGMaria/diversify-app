const Model = require('./model');
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
    await sendError(error, req.body, 'LIST USUÁRIOS', res);
  }
};

exports.get = async (req, res) => {
  try {
    const data = await Model.findOne({
      _id: req.params.id,
    });
    res.json(data);
  } catch (error) {
    await sendError(error, req.body, 'GET USUÁRIO', res);
  }
};

exports.getMe = async (req, res) => {
  try {
    const data = await Model.findOne({
      _id: req.decoded._id,
    });
    res.json(data);
  } catch (error) {
    await sendError(error, req.body, 'GET ME USUÁRIO', res);
  }
};

exports.new = async (req, res) => {
  try {
    const buscaUser = await Model.findOne({
      email: req.body.email,
    });

    if (buscaUser)
      return res.json({
        success: false,
        err: 'Email já cadastrado!',
      });

    var model = new Model(req.body);

    const data = await model.save();

    if (data) {
      res.json({
        success: true,
        data,
      });
    } else {
      res.json({
        success: false,
        data,
        err: req.cfg.erros.padrao,
      });
    }
  } catch (error) {
    await sendError(error, req.body, 'NOVO USUÁRIO', res);
  }
};

exports.delete = async (req, res) => {
  try {
    const model = await Model.findOne({
      _id: req.params.id,
    });

    if (model) {
      model.ativo = false;
      await model.save();
      res.json({
        success: true,
      });
    } else {
      res.json({
        success: false,
        err: req.cfg.erros.padrao,
      });
    }
  } catch (error) {
    await sendError(error, req.body, 'REMOVE USUÁRIO', res);
  }
};

exports.edit = async (req, res) => {
  try {
    const model = await Model.findById(req.body._id);

    const emailExistente = await Model.findOne({
      email: req.body.email,
      _id: {$ne: req.decoded._id},
    });

    if (emailExistente) {
      return res.json({
        success: false,
        form: req.body,
        err: 'Email já registrado por outro usuário.',
      });
    }

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
    await sendError(error, req.body, 'EDITAR USUÁRIO', res);
  }
};
