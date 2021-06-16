"use-strict";

const Artist = require("../models/artist");
const Song = require("../models/song");
const Album = require("../models/album");
const fs = require("fs");
const path = require("path");
const mongoosePag = require("mongoose-pagination");

function getArtist(req, res) {
  var artistId = req.params.id;

  Artist.findById(artistId, (err, artist) => {
    if (err) {
      res.status(500).send({ message: "Error en la peticion" });
    } else {
      if (!artist) {
        res.status(404).send({ message: "El artista no existe" });
      } else {
        res.status(200).send({ artist });
      }
    }
  });
}

function saveArtist(req, res) {
  var artist = new Artist();
  var params = req.body;
  artist.name = params.name;
  artist.description = params.description;
  artist.image = "null";

  artist.save((err, artistStored) => {
    if (err) {
      res.status(500).send({ message: "Error al guardar el artista" });
    } else {
      if (!artistStored) {
        res.status(404).send({ message: "El artista no ha sido guardado" });
      } else {          
        res.status(200).send({ artist: artistStored });
      }
    }
  });
}

function getAllArtist(req, res) {
  if (req.params.page) {
    var page = req.params.page;
  } else {
    var page = 1;
  }
  var page = req.params.page;
  var itemsPerPage = 20;

  Artist.find()
    .sort("name")
    .paginate(page, itemsPerPage, (err, artists, total) => {
      if (err) {
        res.status(500).send({ message: "Error en la peticion" });
      } else {
        if (!artists) {
          res.status(404).send({ message: "No hay artistas" });
        } else {
          return res.status(200).send({ total_items: total, artists: artists });
        }
      }
    });
}

function updateArtist(req, res) {
  var artistId = req.params.id;
  var update = req.body;

  Artist.findByIdAndUpdate(artistId, update, (err, artistUpdate) => {
    if (err) {
      res.status(500).send({ message: "Error al actualizar el artista" });
    } else {
      if (!artistUpdate) {
        res.status(404).send({ message: "No hay artistas" });
      } else {
        return res.status(200).send({ artist: artistUpdate });
      }
    }
  });
}

function deleteArtist(req, res) {
  var artistId = req.params.id;
  Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
    if (err) {
      res.status(500).send({ message: "Error al eliminar el artista" });
    } else {
      if (!artistRemoved) {
        res.status(404).send({ message: "El artista no ha sido eliminado" });
      } else {
        Album.find({ artist: artistRemoved._id }).deleteOne(
          (err, albumRemoved) => {
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
                        res.status(200).send({ artist: artistRemoved });
                      }
                    }
                  }
                );
              }
            }
          }
        );
      }
    }
  });
}

function uploadImage(req, res){
    var artistId = req.params.id;
    var fileName = 'No subido...';
    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1].toLowerCase();
        
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdate) => {
                if(!artistUpdate){
                    res.status(404).send({message:"No se ha podido actualizar el usuario"})
                }else{
                    res.status(200).send({artist: artistUpdate});
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
    var path_file = './uploads/artists/'+image_file;
    
    fs.exists(path_file, function(exixts){
        if(exixts){
            res.sendFile(path.resolve(path_file))
        }else{
            res.status(200).send({message: "No existe la imagen...."});
        }
    })
}


module.exports = {
  getArtist,
  saveArtist,
  getAllArtist,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
};
