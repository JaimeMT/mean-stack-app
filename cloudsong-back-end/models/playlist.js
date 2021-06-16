'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = Schema({
    title:String,
    description:String,
    year:Number,
    image:String,
    user: {type: Schema.ObjectId, ref: 'User'},
    songs: [{type: Schema.ObjectId, ref: 'Song'}]
});

module.exports = mongoose.model('Playlist', PlaylistSchema);