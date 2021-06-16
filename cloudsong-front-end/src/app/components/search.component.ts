import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Artist } from '../models/artist.model';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';

import { AlbumService } from '../services/album.service';
import { Album } from '../models/album.model';
import { SongService } from '../services/song.service';
import { Song } from '../models/song.model';
import { User } from '../models/user.model';
import { Playlist } from '../models/playlist.model';
import { PlaylistService } from '../services/playlist.service';
import { ArtistService } from '../services/artist.service';


@Component({
    selector: 'search',
    templateUrl: '../views/search.html',
    providers: [UserService, SongService, AlbumService, ArtistService]
})

export class SearchComponent implements OnInit {
    public songsSearch: Song[];
    public song: Song;
    public url: string;
    public alertMessage;
    public confirmado;
    public songSearched;
    public close: string;
    public searchs;
    public token;
    public filterPost = '';

    constructor(
        private _userService: UserService,
        private _songService: SongService,
    ) {
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;

    }

    ngOnInit() {

    }

    getSongs(amount) {

        const inputSearch = amount.target.value;
        
        if(inputSearch == ''){
            this.songsSearch=[];
        }else{
            this._songService.getSongs(this.token).subscribe(
                res => {
                    
                    this.songsSearch= res['songs'];
    
                },
                error => {
                    var errorMessage = <any>error;
                    if (errorMessage != null) {
    
                        //this.alertMessage = error['error']['message'];
    
                    }
                }
            );
        }

        

    }

    
    rememberSong(song: Song) {
        let songPlayer = JSON.stringify(song);

        let filePath = this.url + 'get-file-song/' + song.file;
        let imagePath = this.url + 'get-image-album/' + song.album['image'];
        var audioobject = document.getElementsByTagName("audio")[0];
        var tr = document.getElementsByClassName(`no-active`);

        for (let i = 0; i < tr.length; i++) {

            if (tr[i].id === song['name']) {

                tr[i].classList.add('act')


            } else {
                tr[i].classList.remove('act')
            }



        }

        localStorage.setItem('sound_song', songPlayer);
        audioobject.pause();
        audioobject.currentTime = 0;
        audioobject.src = this.url + 'get-file-song/' + song.file;
        audioobject.load()
        audioobject.play();

        if (document.getElementById("click-player").classList.contains('fa-play')) {
            document.getElementById("click-player").classList.remove('fa-play');
            document.getElementById("click-player").classList.add('fa-pause');
            audioobject.pause();
            audioobject.currentTime = 0;
            audioobject.src = this.url + 'get-file-song/' + song.file;
            audioobject.load()
            audioobject.play();
        }
       
        const seekSlider = (<HTMLInputElement>document.getElementById('seek-slider'));
        const setSliderMax = () => {
            seekSlider.max = String(Math.floor(audioobject.duration));



            seekSlider.addEventListener('change', () => {
                audioobject.currentTime = Number(seekSlider.value);

            });
        };
        audioobject.addEventListener('timeupdate', function () {
            setSliderMax();
            seekSlider.value = String(Math.floor(audioobject.currentTime));
            var currentTime = audioobject.currentTime;
            document.getElementById('current-time').innerText = fmtMSS(currentTime);

            function fmtMSS(s) {
                var timer = Math.floor(s);
                return (timer - (timer %= 60)) / 60 + (9 < timer ? ':' : ':0') + timer
            }

        });

        localStorage.removeItem('sound_playlist');

        (document.getElementById("player") as any).load();
        (document.getElementById("player") as any).play();

        document.getElementById('image-path').setAttribute('src', imagePath);
        document.getElementById('duration-song').innerHTML = song.duration
        document.getElementById('play-song-title').innerHTML = song.name;
        document.getElementById('play-song-artist').innerHTML = song.album['artist'].name;

    }


}