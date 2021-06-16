"use-strict";

const Artist = require("../models/artist");
const Song = require("../models/song");
const Album = require("../models/album");
const fs = require("fs");
const path = require("path");
const mongoosePag = require("mongoose-pagination");
const { param } = require("../routers/routes-user");
const album = require("../models/album");

function getAlbum(req, res) {
  var albumId = req.params.id;

  Album.findById(albumId)
    .populate({ path: "artist" })
    .exec((err, albumStored) => {
      if (err) {
        res.status(500).send({ message: "Error en la peticion" });
      } else {
        if (!albumStored) {
          res.status(404).send({ message: "El album no existe" });
        } else {
          res.status(200).send({ albumStored });
        }
      }
    });
}

function getAlbums(req, res) {
  var artistId = req.params.artist;

  if (!artistId) {
    var find = Album.find().sort("title");
  } else {
    var find = Album.find({artist: artistId}).sort('year');
  }

  find.populate({path: 'artist'}).exec((err, albums) => {
    if (err) {
      res.status(500).send({ message: "Error en la peticion" });
    } else {
      if (!albums) {
        res.status(404).send({ message: "No hay albums" });
      } else {
        res.status(200).send({ albums });
      }
    }
  })
}

function saveAlbum(req, res) {
  var album = new Album();

  var params = req.body;

  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = "null";
  album.artist = params.artist;

  album.save((err, albumStored) => {
    if (err) {
      res.status(500).send({ message: "Error al guardar el album" });
    } else {
      if (!albumStored) {
        res.status(404).send({ message: "El album no ha sido guardado" });
      } else {
        res.status(200).send({ album: albumStored });
      }
    }
  });
}

function updateAlbum(req,res){
  var albumId = req.params.id;
  var update = req.body;

  Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
    if (err) {
      res.status(500).send({ message: "Error al actualizar el album" });
    } else {
      if (!albumUpdated) {
        res.status(404).send({ message: "El album no ha sido actualizado" });
      } else {
        res.status(200).send({ album: albumUpdated });
      }
    }
  })
}

function deleteAlbum(req, res){
  var albumId = req.params.id;
  Album.findByIdAndRemove(albumId , (err, albumRemoved) => {
      if (err) {
        res.status(500).send({ message: "Error al eliminar el album" });
      } else {
        if (!albumRemoved) {
          res
            .status(404)
            .send({ message: "El album no ha sido eliminado" });
        } else {
          Song.find({ album: albumRemoved._id }).deleteOne(
            (err, songRemoved) => {
              if (err) {
                res
                  .status(500)
                  .send({ message: "Error al eliminar la cancion" });
              } else {
                if (!songRemoved) {
                  res
                    .status(404)
                    .send({ message: "La cancion no ha sido eliminada" });
                } else {
                  res.status(200).send({ album: albumRemoved });
                }
              }
            }
          );
        }
      }
    }
  );
}

function uploadImage(req, res){
  var albumId = req.params.id;
  var fileName = 'No subido...';
  if(req.files){
      var file_path = req.files.image.path;
      var file_split = file_path.split('\\');
      var file_name = file_split[2];

      var ext_split = file_name.split('\.');
      var file_ext = ext_split[1].toLowerCase();
      
      if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

          Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
              if(!albumUpdated){
                  res.status(404).send({message:"No se ha podido actualizar el album"})
              }else{
                  res.status(200).send({album: albumUpdated});
              }
          });

      }else{
          res.status(200).send({message: "Extension del archivo incorrecto"});
      }

  }else{
      res.status(200).send({message: "No has subido ninguna imagen...."});
  }
}

function getImageFile(req, res){
  var image_file = req.params.image_file;
  var path_file = './uploads/albums/'+image_file;
  
  fs.exists(path_file, function(exixts){
      if(exixts){
          res.sendFile(path.resolve(path_file))
      }else{
          res.status(200).send({message: "No existe la imagen...."});
      }
  })
}

module.exports = {
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
};
