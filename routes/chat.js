var express = require('express');
var router = express.Router();

//rota destinada a pagina de chat
router.get("/:nomeEmpresa", function(req, res, next){

  res.render("chatbot", {
    title: "chatbot"
  });

});

module.exports = router;
