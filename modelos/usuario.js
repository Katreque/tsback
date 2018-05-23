var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UsuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
});

UsuarioSchema.pre('save', function (next) {
  var usuario = this;

  bcrypt.hash(usuario.password, 4, function (err, hash) {
    if (err) {
      return next(err);
    }
    usuario.password = hash;
    next();
  })
});

UsuarioSchema.statics.autenticar = function (username, password, callback) {
  Usuario.findOne({ username: username })
    .exec(function (err, usuario) {
      if (err) {
        return callback(err);

      } else if (!usuario) {
        var err = new Error('Usuário não encontrado!');
        err.status = 401;
        return callback(err);
      }

      bcrypt.compare(password, usuario.password, function (err, result) {
        if (result === true) {
          return callback(null, usuario);
        } else {
          return callback();
        }
      })
    });
}

var Usuario = mongoose.model('Usuarios', UsuarioSchema);
module.exports = Usuario;
