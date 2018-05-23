var express = require('express');
var router = express.Router();
var Usuario = require('../modelos/usuario.js');

router.post('/criar-usuario', function (req, res, next) {
  if (req.body.email &&
    req.body.username &&
    req.body.password) {

    var dadosUsuario = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    }

    Usuario.create(dadosUsuario, function (err, usuario) {
      if (err) {
        return next(err);
      } else {
        req.session.idUsuario = usuario._id;
        return res.send('Tmj!');
      }
    });

  } else {
    var erro = new Error('Todos os campos são necessarios.');
    erro.status = 400;
    return next(erro);
  }
})

router.post('/login', function (req, res, next) {
  if (req.body.username && req.body.password) {
    Usuario.autenticar(req.body.username, req.body.password, function (err, usuario) {
      if (err || !usuario) {
        var erro = new Error('Email ou senha errados.');
        err.status = 401;
        return next(erro);
      } else {
        req.session.idUsuario = usuario._id;
        return res.redirect('/perfil');
      }
    })
  }
})

router.get('/perfil', function(req, res, next) {
  Usuario.findById(req.session.idUsuario)
  .exec(function (error, usuario) {
    if (error) {
      return next(error);
    } else {
      if (usuario === null) {
        var err = new Error('Autentique antes!');
        err.status = 400;
        return next(err);
      } else {
        return res.send('<h1>Nome: </h1>' + usuario.username + '<h2>Email: </h2>' + usuario.email + '<br><a type="button" href="/logout">Logout</a>')
      }
    }
  });
})

module.exports = router;
