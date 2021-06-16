import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Artist } from '../models/artist.model';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';

import { AlbumService } from '../services/album.service';
import { Album } from '../models/album.model';
import { SongService } from '../services/song.service';
import { Song } from '../models/song.model';




@Component({
    selector: 'album-details',
    templateUrl: '../views/album-details.html',
    providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit {

    public album: Album;
    public songs: Song[];
    public song: Song;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public confirmado;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService
    ) { 
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;

    }

    ngOnInit() {
        
        this.getAlbum();
        
        
    }



    getAlbum() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._albumService.getAlbum(this.token, id).subscribe(
                res => {
                    
                    if (!res['albumStored']) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = res['albumStored'];
                        this._songService.getSongs(this.token, res['albumStored']._id).subscribe(
                            res => {
                                if (!res['songs']) {
                                    this.alertMessage = "Este album esta vacio";
                                } else {
                                    this.songs = res['songs'];
                                    
                                }
                            },
                            error => {

                            }
                        )
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    if (errorMessage != null) {

                        //this.alertMessage = error['error']['message'];

                    }
                }
            );
        });
    }

    onDeleteConfirmado(id) {
        this.confirmado = id;
    }

    onCancel() {
        this.confirmado = null;
    }

    onDeleteSong() {
        this._songService.deleteSong(this.token, this.confirmado).subscribe(
            res => {
                if (!res['song']) {
                    alert("Error en el servidor")
                } else {
                    this.getAlbum();
                }
            },
            error => {
                var errorMessage = <any>error;
                if (errorMessage != null) {

                    //this.alertMessage = error['error']['message'];

                }
            }
        )
    }


    startPlayer(song: Song) {
        this._songService.getSongs(this.token, song.album['_id']).subscribe(
            res => {

                var playlist_sound = JSON.stringify(res['songs']);
                localStorage.setItem('sound_playlist', playlist_sound);

            },
            error => {

            }
        )

        let songPlayer = JSON.stringify(song);
        let filePath = this.url + 'get-file-song/' + song.file;
        let imagePath = this.url + 'get-image-album/' + song.album['image'];
        var tr = document.getElementsByClassName(`no-active`);
        var audioobject = document.getElementsByTagName("audio")[0];

        for (let i = 0; i < tr.length; i++) {

            if (tr[i].id === song['_id']) {

                tr[i].classList.add('act')
            
            } else {
                tr[i].classList.remove('act')
            }



        }
        if(audioobject == null){
            console.log("yes")
        }
        localStorage.setItem('sound_song', songPlayer);
        audioobject.src = filePath;
        (document.getElementById("player") as any).play();
        document.getElementById("click-player").classList.remove('fa-play');
        document.getElementById("click-player").classList.add('fa-pause');
        
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

        (document.getElementById("player") as any).play();

        document.getElementById('image-path').setAttribute('src', imagePath);
        document.getElementById('duration-song').innerHTML = song.duration
        document.getElementById('play-song-title').innerHTML = song.name;
        document.getElementById('play-song-artist').innerHTML = song.album['artist'].name;


    }

    

}