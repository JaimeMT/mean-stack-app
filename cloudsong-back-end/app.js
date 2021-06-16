'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const user_routes = require('./routers/routes-user');
const artist_routes = require('./routers/routes-artist');
const album_routes = require('./routers/routes-album');
const song_routes = require('./routers/routes-song');
const playlist_routes = require('./routers/routes-playlist');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
})

app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);
app.use('/api', playlist_routes);

module.exports = app;