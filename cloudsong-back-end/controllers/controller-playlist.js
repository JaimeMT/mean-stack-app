"use-strict";

const Artist = require("../models/artist");
const Song = require("../models/song");
const Album = require("../models/album");
const fs = require("fs");
const path = require("path");
const mongoosePag = require("mongoose-pagination");
const { param } = require("../routers/routes-song");
const song = require("../models/song");
const Playlist = require("../models/playlist");
const playlist = require("../models/playlist");

function savePlaylist(req, res) {
  var playlist = new Playlist();

  var params = req.body;

  playlist.title = params.title;
  playlist.description = params.description;
  playlist.year = params.year;
  playlist.image = "null";
  playlist.user = req.params.id;
  playlist.songs = params.song;

  playlist.save((err, playlistStored) => {
    if (err) {
      res.status(500).send({ message: "Error al guardar la playlist" });
    } else {
      if (!playlistStored) {
        res.status(404).send({ message: "La playlist no ha sido guardada" });
      } else {
        res.status(200).send({ playlist: playlistStored });
      }
    }
  });
}

function updatePlaylist(req,res){
  var playlistId = req.params.id;
  var update = req.body;

  
  Playlist.findByIdAndUpdate(playlistId, update, (err, playlistUpdate) => {
    if (err) {
      res.status(500).send({ message: "Error al actualizar la playlist" });
    } else {
      if (!playlistUpdate) {
        res.status(404).send({ message: "La playlist no ha sido actualizada" });
      } else {
        console.log(playlistUpdate)
        res.status(200).send({ playlist: playlistUpdate });
      }
    }
  })
}

function uploadImage(req, res){
  var playlistId = req.params.id;
  var fileName = 'No subido...';
  if(req.files){
      var file_path = req.files.image.path;
      var file_split = file_path.split('\\');
      var file_name = file_split[2];

      var ext_split = file_name.split('\.');
      var file_ext = ext_split[1].toLowerCase();
      
      if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

          Playlist.findByIdAndUpdate(playlistId, {image: file_name}, (err, playlistUpdate) => {
              if(!playlistUpdate){
                  res.status(404).send({message:"No se ha podido actualizar la playlist"})
              }else{
                  res.status(200).send({playlist: playlistUpdate});
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
  var path_file = './uploads/playlists/'+image_file;
  
  fs.exists(path_file, function(exixts){
      if(exixts){
          res.sendFile(path.resolve(path_file))
      }else{
          res.status(200).send({message: "No existe la imagen...."});
      }
  })
}

function getPlaylist(req, res) {
  var playlistId = req.params.id;

  Playlist.findById(playlistId)
    .populate({
      path: "songs",
      populate: {
        path: "album",
        model: "Album",
        populate: {
          path: "artist",
          model: "Artist",
        },
      },
    })
    .exec((err, playlistStored) => {
      if (err) {
        res.status(500).send({ message: "Error en la peticion" });
      } else {
        if (!playlistStored) {
          res.status(404).send({ message: "El album no existe" });
        } else {
          res.status(200).send({ playlistStored });
        }
      }
    });
}

function getPlaylists(req, res) {
  var userId = req.params.user;

  var find = Playlist.find({ user: userId }).sort("year");

  find.populate({ path: "user" }).exec((err, playlist) => {
    if (err) {
      res.status(500).send({ message: "Error en la peticion" });
    } else {
      if (!playlist) {
        res.status(404).send({ message: "No hay playlist" });
      } else {
        res.status(200).send({ playlists: playlist });
      }
    }
  });
}

function addSongPlayslist(req, res) {
  let playlistId = req.params.id;
  let params = req.body;
  let song = params.song;
  Playlist.findById(playlistId).exec((err, yeah) => {
    if (err) {
      res.status(500).send({ message: "Error en la peticion" });
    } else {
      Playlist.findOne({songs: song, _id: playlistId}).exec((err, success) => {
        if(err){
          res.status(500).send({ message: "Error en la peticion" });
        }else{
          if(success == null){
            Playlist.findByIdAndUpdate(
              playlistId,
          
              { $push: { songs: song } }
            ) 
              .populate({
                path: "songs",
                populate: {
                  path: "album",
                  model: "Album",
                  populate: {
                    path: "artist",
                    model: "Artist",
                  },
                },
              })
              .exec((error, success) => {
                if (error) {
                  res.status(500).send({ message: "Error en la peticion" });
                } else {
                  
                  res.status(200).send({playlist: success});
                }
              });
          }else{
            res.status(200).send(null);
          }
        }
        
      })
      
      
    }
  })

  /*
  
    */
    
}

function deletePlaylist(req, res) {
  var playlistId = req.params.id;

  Playlist.findByIdAndRemove(playlistId, (err, playlistRemoved) => {
    if (err) {
      res.status(500).send({ message: "Error al eliminar la playlist" });
    } else {
      if (!playlistRemoved) {
        res.status(404).send({ message: "La playlist no ha sido eliminada" });
      } else {
       
        res.status(200).send({ playlist: playlistRemoved });
      }
    }
  });
}

function deleteSongFromPlaylist(req, res) {
  var playlistId = req.params.id;
  let params = req.body;
  let song = params.song;
  Playlist.findByIdAndUpdate(
    playlistId,

    { $pull: { songs: song } }
  ) 
    .exec((error, success) => {
      if (error) {
        res.status(500).send({ message: "Error en la peticion" });
      } else {
        Playlist.findById(success._id).populate({
          path: "songs",
          populate: {
            path: "album",
            model: "Album",
            populate: {
              path: "artist",
              model: "Artist",
            },
          },
        })
        .exec((error, success) => {
          if(error){
            res.status(500).send({ message: "Error en el servidor" });
          }else{
            
            res.status(200).send({playlist: success});
          }
        })
      }
    });
}

module.exports = {
  savePlaylist,
  getPlaylist,
  getPlaylists,
  deletePlaylist,
  addSongPlayslist,
  deleteSongFromPlaylist,
  getImageFile,
  uploadImage,
  updatePlaylist
};
