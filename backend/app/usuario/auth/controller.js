const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const config = require('../../../config');
const Usuario = require('../model');
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

exports.new = async (req, res) => {
  try {
    const buscaUser = await Usuario.findOne({
      email: req.body.email,
    });

    if (buscaUser)
      return res.json({
        success: false,
        err: 'Email já cadastrado!',
      });

    var model = new Usuario(req.body);

    var beAToken = {};
    beAToken.email = model.email;
    beAToken._id = model._id;
    beAToken.nome = model.nome;

    var token = jwt.sign(beAToken, config.secret, {
      expiresIn: '365d', // expires in 24 hours
    });

    const data = await model.save();

    if (data) {
      res.json({
        success: true,
        data,
        token,
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

exports.login = async (req, res) => {
  try {
    let user = await Usuario.findOne({email: req.body.email});

    if (!user) {
      return res.json({
        success: false,
        err: 'Senha ou usuário incorreto',
        email: req.body.email,
      });
    } else {
      bcrypt.compare(req.body.password, user.password, function(err, ok) {
        if (ok /*|| (req.body.facebook && req.body.facebookToken)*/) {
          console.log('Login de usuário: ' + user.nome + ' : ' + user.email);

          var beAToken = {};
          beAToken.email = user.email;
          beAToken._id = user._id;
          beAToken.nome = user.nome;

          var token = jwt.sign(beAToken, config.secret, {
            expiresIn: '365d', // expires in 24 hours
          });

          res.json({
            success: true,
            err: 'Login de root efetuado com sucesso!',
            token: token,
          });
        } else {
          res.json({success: false, err: 'Senha ou usuário incorreto'});
        }
      });
    }
  } catch (error) {
    await sendError(error, req.body, 'LOGIN USUÁRIO', res);
  }
};
