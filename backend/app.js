const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").Server(app);
const cors = require("cors");

require("./connection");

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(cors());

app.get("/api/", function (req, res, next) {
  res.json("online");
});

// cadastro publica

//app.post('/api/cadastro', usuarioController.new);

/*Login de Usuarios Admin*/
app.use("/api/", require("./app/usuario/auth"));

/*Mid para rotas da API verificar JWT*/
var jwt = require("./core/jwt");
app.use("/api/jwt", jwt);

/*Modulos*/
jwt.use("/ativo", require("./app/ativo"));
jwt.use("/categoria", require("./app/categoria"));
jwt.use("/investimento", require("./app/investimento"));
jwt.use("/setor", require("./app/setor"));
jwt.use("/usuario", require("./app/usuario"));
jwt.use("/feedback", require("./app/feedback"));

module.exports = server;