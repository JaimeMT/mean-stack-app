import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';

import { SongService } from '../services/song.service';
import { Song } from '../models/song.model';

import { Playlist } from '../models/playlist.model';
import { PlaylistService } from '../services/playlist.service';



@Component({
    selector: 'playlist-details',
    templateUrl: '../views/playlist-details.html',
    providers: [UserService, PlaylistService, SongService]
})

export class PlaylistDetailComponent implements OnInit {
    public playlist: Playlist;
    public songsSearch: Song[];
    public songsAdded: Song[];
    public song: Song;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public confirmado;
    public filterPost = '';
    public closed;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
        private _playlistService: PlaylistService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.closed = true;
    }

    ngOnInit() {
        var songAudio = document.getElementsByTagName('audio')[0];


        this.getPlaylist();

    }

    getPlaylist() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._playlistService.getPlaylist(this.token, id).subscribe(
                res => {

                    if (!res['playlistStored']) {
                        this._router.navigate(['/']);
                    } else {

                        this.playlist = res['playlistStored'];
                        localStorage.setItem('sound_playlist', JSON.stringify(this.playlist.songs))
                        this.songsAdded = res['playlistStored']['songs'];

                        if (this.songsAdded.length == 0) {
                            this.closed = false;
                        }


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

    close() {
        this.closed = true;
        document.getElementById('close').style.visibility = 'hidden';
        document.getElementById('search-more').style.visibility = 'visible';
    }

    search() {
        this.closed = false;
        document.getElementById('close').style.visibility = 'visible';
    }

    getSongs(amount) {

        const inputSearch = amount.target.value;

        if (inputSearch == '') {
            this.songsSearch = [];
        } else {
            this._songService.getSongs(this.token).subscribe(
                res => {

                    this.songsSearch = res['songs'];

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



    addSongtoPlaylist(songId) {

        this._playlistService.addSongtoPlaylist(songId, this.playlist['_id']).subscribe(
            res => {
                this.playlist = res['playlist'];
                console.log(res['playlist'])

                this.getPlaylist();

            },
            error => {
                var errorMessage = <any>error;
                if (errorMessage != null) {

                    //this.alertMessage = error['error']['message'];

                }
            }
        )
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

    startPlayer(song: Song) {

        localStorage.setItem('sound_playlist', JSON.stringify(this.playlist.songs))
        let songPlayer = JSON.stringify(song);
        var audioobject = document.getElementsByTagName("audio")[0];
        let imagePath = this.url + 'get-image-album/' + song.album['image'];

        var tr = document.getElementsByClassName(`no-active`);
        for (let i = 0; i < tr.length; i++) {

            if (tr[i].id === song['_id']) {

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

        document.getElementById('image-path').setAttribute('src', imagePath);
        document.getElementById('duration-song').innerHTML = song.duration
        document.getElementById('play-song-title').innerHTML = song.name;
        document.getElementById('play-song-artist').innerHTML = song.album['artist'].name;


    }

    nextTrack() {

        var playlist_sound = JSON.parse(localStorage.getItem('sound_playlist'));


        var song = JSON.parse(localStorage.getItem('sound_song'));

        var index = playlist_sound.map(function (e) { return e.name; }).indexOf(song.name);
        console.log(this.song);

        if (index + 1 === playlist_sound.length) {



        } else {

            localStorage.setItem('sound_song', JSON.stringify(playlist_sound[index + 1]));
            song = JSON.parse(localStorage.getItem('sound_song'))
            this.song = song;
            let imagePath = this.url + 'get-image-album/' + song.album['image'];
            var tr = document.getElementsByClassName(`no-active`);

            for (let i = 0; i < tr.length; i++) {

                if (tr[i].id === song['_id']) {

                    tr[i].classList.add('act')


                } else {
                    tr[i].classList.remove('act')
                }



            }
            let filePath = this.url + 'get-file-song/' + song.file;
            document.getElementById("mp3-source").setAttribute("src", filePath);

            var audioobject = document.getElementsByTagName("audio")[0];
            audioobject.remove();

            var audio = document.createElement('audio')
            document.getElementById('reproductor').appendChild(audio)
            audio.id = "player";

            var source = document.createElement('source')
            audio.appendChild(source);
            source.id = "mp3-source"
            source.type = "audio/mpeg";
            source.src = filePath

            if (document.getElementById("click-player").classList.contains('fa-play')) {

                document.getElementById("click-player").classList.remove('fa-play');
                document.getElementById("click-player").classList.add('fa-pause');

                (document.getElementById("player") as any).play();

            }

            if (document.getElementById("click-player").classList.contains('fa-pause')) {
                (document.getElementById("player") as any).play();
            }

            let inputSlider = document.getElementById("seek-slider");
            inputSlider.remove();
            let inputNewSlider = document.createElement('input');
            document.getElementById("position-seek-slider").appendChild(inputNewSlider);
            inputNewSlider.type = "range";
            inputNewSlider.min = '0';
            inputNewSlider.step = '1'
            inputNewSlider.id = 'seek-slider';
            inputNewSlider.className = 'seek_slider';

            var audioSong = document.getElementsByTagName("audio")[0];

            const seekSlider = (<HTMLInputElement>document.getElementById('seek-slider'));
            const setSliderMax = () => {

                seekSlider.max = String(Math.floor(audioSong.duration));

                if (audioSong.currentTime === audioSong.duration && index + 1 === playlist_sound.length - 1) {
                    for (let i = 0; i < tr.length; i++) {

                        tr[i].classList.remove('act')

                    }
                    audioSong.pause;
                    document.getElementById("click-player").classList.remove('fa-pause');
                    document.getElementById("click-player").classList.add('fa-play');
                } else if (audioSong.currentTime === audioSong.duration && index + 1 !== playlist_sound.length - 1) {
                    this.nextTrack();
                }


                seekSlider.addEventListener('change', () => {
                    audioSong.currentTime = Number(seekSlider.value);

                });

            }

            audioSong.addEventListener('timeupdate', function () {

                setSliderMax();
                seekSlider.value = String(Math.floor(audioSong.currentTime));
                var currentTime = audioSong.currentTime;
                document.getElementById('current-time').innerText = fmtMSS(currentTime);


            });
            function fmtMSS(s) {
                var timer = Math.floor(s);
                return (timer - (timer %= 60)) / 60 + (9 < timer ? ':' : ':0') + timer
            }


            const input = (<HTMLInputElement>document.getElementById("volume-control")).value;
            audioSong.volume = Number(input);
            document.getElementById('image-path').setAttribute('src', imagePath);
            document.getElementById('duration-song').innerHTML = song.duration
            document.getElementById('play-song-title').innerHTML = song.name;
            document.getElementById('play-song-artist').innerHTML = song.album['artist'].name;

        }



    }


    onDeleteConfirmado(id, songId) {


        this._playlistService.deleteSongFromPlaylist(id, songId).subscribe(
            res => {
                this.playlist = res['playlist'];
                localStorage.setItem('sound_playlist', JSON.stringify(this.playlist.songs))
                this.getPlaylist();
            },
            error => {
                var errorMessage = <any>error;
                if (errorMessage != null) {

                    //this.alertMessage = error['error']['message'];

                }
            }
        )
    }

    onCancel() {
        this.confirmado = null;
    }

}