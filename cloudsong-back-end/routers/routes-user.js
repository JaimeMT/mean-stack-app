'use strict'

const express = require('express');
const UserController = require('../controllers/controller-user');

const api = express.Router();
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir:'./uploads/users'});

api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-img-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImg);
api.get('/get-image-user/:image_file', UserController.getImageFile);

module.exports = api;
