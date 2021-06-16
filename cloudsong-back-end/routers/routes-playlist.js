"use strict";

const express = require("express");
const PlaylistController = require("../controllers/controller-playlist");
const api = express.Router();
const md_auth = require("../middlewares/authenticated");

const multipart = require("connect-multiparty");
var md_upload = multipart({
  uploadDir: "./uploads/playlists",
});

api.post("/playlist/:id", md_auth.ensureAuth, PlaylistController.savePlaylist);
api.get("/playlist/:id", md_auth.ensureAuth, PlaylistController.getPlaylist);
api.get("/playlists/:user", md_auth.ensureAuth, PlaylistController.getPlaylists);
api.delete("/playlist/:id", md_auth.ensureAuth, PlaylistController.deletePlaylist);
api.put("/playlist/:id", PlaylistController.addSongPlayslist);
api.put("/delete-song/:id", PlaylistController.deleteSongFromPlaylist);
api.post("/upload-image-playlist/:id", [md_auth.ensureAuth, md_upload], PlaylistController.uploadImage);
api.get("/get-image-playlist/:image_file", PlaylistController.getImageFile);
api.put("/playlist-edit/:id", md_auth.ensureAuth, PlaylistController.updatePlaylist);

module.exports = api;