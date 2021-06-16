"use strict";

const User = require("../models/users");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const fs = require("fs");
const path = require("path");



function saveUser(req, res) {
  var user = new User();
  var params = req.body;
  console.log(params);
  user.name = params.name;
  user.surname = params.surname;
  user.email = params.email;
  user.role = "ROLE_USER";
  user.image = "null";

  if (params.password) {
    bcrypt.hash(params.password, null, null, function (err, hash) {
      user.password = hash;
      if (user.name != null && user.surname != null && user.email != null) {

        User.findOne({email: user.email.toLowerCase()}).exec((err, success)=>{
          if(err){
            res.status(500).send({ message: "Error al encontrar el usuario" });
          }else{
            if(!success){
              user.save((err, userStored) => {
                if (err) {
                  res.status(500).send({ message: "Error al guardar el usuario" });
                } else {
                  if (!userStored) {
                    res
                      .status(404)
                      .send({ message: "No se ha registrado el usuario" });
                  } else {
                    res.status(200).send({ user: userStored });
                  }
                }
              });
            }else{
              res.status(404).send({ message: 'Este usuario ya esta registrado' });
            }
          }
        });

        
      } else {
        res.status(200).send({ message: "Introduce los datos requeridos" });
      }
    });
  } else {
    res.status(200).send({ message: "Introduce la contraseña" });
  }
}

function loginUser(req, res) {
  var params = req.body;

  var email = params.email;
  var password = params.password;

  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) {
      res.status(500).send({ message: "Error en la peticion" });
    } else {
      if (!user) {
        res.status(404).send({ message: "El usuario no existe" });
      } else {
        bcrypt.compare(password, user.password, (err, check) => {
          if (check) {
            if (params.gethash) {
              res.status(200).send({ token: jwt.createToken(user) });
            } else {
              res.status(200).send({ user });
            }
          } else {
            res
              .status(404)
              .send({ message: "El usuario no ha podido loguearse" });
          }
        });
      }
    }
  });
}

function updateUser(req, res) {
  var userId = req.params.id;
  var update = req.body;
  if (userId != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tienes permiso para actualizar este usuario" });
  }
  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if (err) {
      res.status(500).send({ message: "Error al actualizar el usuario" });
    } else {
      if (!userUpdated) {
        res
          .status(404)
          .send({ message: "No se ha podido actualizar el usuario" });
      } else {
        res.status(200).send({ user: userUpdated });
      }
    }
  });
}

function uploadImg(req, res) {
  var userId = req.params.id;
  var fileName = "No subido...";
  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split("\\");
    var file_name = file_split[2];

    var ext_split = file_name.split(".");
    var file_ext = ext_split[1].toLowerCase();

    if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif") {
      User.findByIdAndUpdate(
        userId,
        { image: file_name },
        (err, userUpdated) => {
          if (!userUpdated) {
            res
              .status(404)
              .send({ message: "No se ha podido actualizar el usuario" });
          } else {
            res.status(200).send({ image: file_name, user: userUpdated });
          }
        }
      );
    } else {
      res.status(200).send({ message: "Extension del archivo incorrecto" });
    }
  } else {
    res.status(200).send({ message: "No has subido ninguna imagen...." });
  }
}

function getImageFile(req, res) {
  var image_file = req.params.image_file;
  var path_file = "./uploads/users/" + image_file;

  fs.exists(path_file, function (exixts) {
    if (exixts) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({ message: "No existe la imagen...." });
    }
  });
}

module.exports = {
  saveUser,
  loginUser,
  updateUser,
  uploadImg,
  getImageFile,
};
