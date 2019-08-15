var express = require('express');
var router = express.Router();
var firestore = require("./../public/models/firestore");
var db = new firestore();
var Empresa = require("./../public/models/Empresa");

//rota destinada a pagina de chat
router.get("/:nomeEmpresa", function(req, res, next){

  let empresa = new Empresa();

  let nomeEmpresa = req.params.nomeEmpresa;

  empresa.getEmpresaByName(db, nomeEmpresa).then(results =>{

    res.render("chatbot", {
      title: "chatbot",
      results
    });

  }).catch(err =>{

    res.send(err);

  });

});

module.exports = router;
