import { Component, OnInit } from '@angular/core';
import { Song } from '../models/song.model';
import { GLOBAL } from '../services/global';
import { Router, ActivatedRoute } from '@angular/router'
@Component({
    selector: 'player-app',
    templateUrl: '../views/player.html'
})

export class PlayerComponent implements OnInit {
    public url: string;
    public song;
    public volumen;
    public artistId: string;
    public index: number;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
    ) {
        this.url = GLOBAL.url;
        this.song = new Song(1, '', '', '', '');
        this.volumen = 100;
    }

    ngOnInit() {
        let song = JSON.parse(localStorage.getItem('sound_song'));
        let volumenSave = JSON.parse(localStorage.getItem('volumen-save'));
        var inputv = (<HTMLInputElement>document.getElementById("volume-control")).value;
        
        if (volumenSave) {
            this.volumen = volumenSave;
            inputv = this.volumen
        } else {
            let volumen = 1;
            localStorage.setItem('volumen-save', String(volumen))
            volumenSave = JSON.parse(localStorage.getItem('volumen-save'));
            this.volumen = volumen;
            inputv = this.volumen
        }



        var audioobject = document.getElementsByTagName('audio')[0];
        const control = document.getElementById("volume-control");


        if (audioobject.src == '') {

            const control = document.getElementById("volume-control");
            control.style.backgroundImage = `-webkit-gradient(linear,left top, right top, color-stop(${this.volumen * 100}%, #ffffff), color-stop(${this.volumen * 100}%, #000000))`;

        } else {

            audioobject.volume = this.volumen;
            control.style.backgroundImage = `-webkit-gradient(linear,left top, right top, color-stop(${this.volumen * 100}%, #ffffff), color-stop(${this.volumen * 100}%, #000000))`;

        }

        if (song) {
            this.song = song;

        } else {
            this.song = new Song(1, '', '', '', '');

        }

    }

    prevTrack() {
        var playlist_sound = JSON.parse(localStorage.getItem('sound_playlist'));
        var audioSong = document.getElementsByTagName("audio")[0];
        var song = JSON.parse(localStorage.getItem('sound_song'));

        var index = playlist_sound.map(function (e) { return e.name; }).indexOf(song.name);

        if (index === 0) {

        } else {

            localStorage.setItem('sound_song', JSON.stringify(playlist_sound[index - 1]));
            song = JSON.parse(localStorage.getItem('sound_song'))

            if (document.getElementById("click-player").classList.contains('fa-play')) {

                document.getElementById("click-player").classList.remove('fa-play');
                document.getElementById("click-player").classList.add('fa-pause');

                audioSong.pause();
                audioSong.currentTime = 0;
                audioSong.src = this.url + 'get-file-song/' + song.file;
                audioSong.load()
                audioSong.play();

            }
            if (document.getElementById("click-player").classList.contains('fa-pause')) {


                audioSong.pause();
                audioSong.currentTime = 0;
                audioSong.src = this.url + 'get-file-song/' + song.file;
                audioSong.load()
                audioSong.play();

            }

            const seekSlider = (<HTMLInputElement>document.getElementById('seek-slider'));
            const setSliderMax = () => {

                seekSlider.max = String(Math.floor(audioSong.duration));

                if (audioSong.currentTime === audioSong.duration && index - 1 === playlist_sound.length - 1) {
                    audioSong.pause;
                    console.log("pause")
                    document.getElementById("click-player").classList.remove('fa-pause');
                    document.getElementById("click-player").classList.add('fa-play');
                } else if (audioSong.currentTime === audioSong.duration && index - 1 !== playlist_sound.length - 1) {
                    console.log("play")
                    this.nextTrack();

                }

                seekSlider.addEventListener('change', () => {
                    audioSong.currentTime = Number(seekSlider.value);

                });

            }

            audioSong.addEventListener('timeupdate', function () {

                setSliderMax();
                seekSlider.value = String(Math.floor(audioSong.currentTime));
                var duration = audioSong.duration;

                var currentTime = audioSong.currentTime;
                document.getElementById('duration-song').innerHTML = fmtMSS(duration);
                document.getElementById('current-time').innerText = fmtMSS(currentTime);


            });
            function fmtMSS(s) {
                var timer = Math.floor(s);
                return (timer - (timer %= 60)) / 60 + (9 < timer ? ':' : ':0') + timer
            }
            const input = (<HTMLInputElement>document.getElementById("volume-control")).value;
            audioSong.volume = Number(input);
            let imagePath = this.url + 'get-image-album/' + song.album['image'];
            document.getElementById('image-path').setAttribute('src', imagePath);
            document.getElementById('duration-song').innerHTML = song.duration
            document.getElementById('play-song-title').innerHTML = song.name;
            document.getElementById('play-song-artist').innerHTML = song.album['artist'].name;
            var tr = document.getElementsByClassName(`no-active`);

            for (let i = 0; i < tr.length; i++) {

                if (tr[i].id === song['_id']) {

                    tr[i].classList.add('act')

                } else {
                    tr[i].classList.remove('act')
                }



            }
        }

    }



    nextTrack() {


        var playlist_sound = JSON.parse(localStorage.getItem('sound_playlist'));


        var audioSong = document.getElementsByTagName("audio")[0];
        var song = JSON.parse(localStorage.getItem('sound_song'));

        var index = playlist_sound.map(function (e) { return e.name; }).indexOf(song.name);

        if (index + 1 === playlist_sound.length) {

            console.log("esta es la ultima cancion");

        } else {

            localStorage.setItem('sound_song', JSON.stringify(playlist_sound[index + 1]));
            song = JSON.parse(localStorage.getItem('sound_song'))



            if (document.getElementById("click-player").classList.contains('fa-play')) {

                document.getElementById("click-player").classList.remove('fa-play');
                document.getElementById("click-player").classList.add('fa-pause');

                audioSong.pause();
                audioSong.currentTime = 0;
                audioSong.src = this.url + 'get-file-song/' + song.file;
                audioSong.load()
                audioSong.play();

            }

            if (document.getElementById("click-player").classList.contains('fa-pause')) {
                audioSong.pause();
                audioSong.currentTime = 0;
                audioSong.src = this.url + 'get-file-song/' + song.file;
                audioSong.load()
                audioSong.play();

            }





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
                var duration = audioSong.duration;

                var currentTime = audioSong.currentTime;
                document.getElementById('duration-song').innerHTML = fmtMSS(duration);
                document.getElementById('current-time').innerText = fmtMSS(currentTime);



            });
            function fmtMSS(s) {
                var timer = Math.floor(s);
                return (timer - (timer %= 60)) / 60 + (9 < timer ? ':' : ':0') + timer
            }
            const input = (<HTMLInputElement>document.getElementById("volume-control")).value;
            audioSong.volume = Number(input);
            let imagePath = this.url + 'get-image-album/' + song.album['image'];
            document.getElementById('image-path').setAttribute('src', imagePath)
            document.getElementById('duration-song').innerHTML = song.duration
            document.getElementById('play-song-title').innerHTML = song.name;
            document.getElementById('play-song-artist').innerHTML = song.album['artist'].name;
            var tr = document.getElementsByClassName(`no-active`);

            for (let i = 0; i < tr.length; i++) {

                if (tr[i].id === song['_id']) {

                    tr[i].classList.add('act')
                    for (let j in tr[i].childNodes) {

                    }
                } else {
                    tr[i].classList.remove('act')
                }



            }
        }


    }

    playMusic() {

        var audioobject = document.getElementsByTagName('audio')[0];
        const clickPlayer = document.getElementById('click-player');

        if (clickPlayer.classList.contains('fa-play')) {

            clickPlayer.classList.remove('fa-play');
            clickPlayer.classList.add('fa-pause');
            audioobject.play();

            const seekSlider = (<HTMLInputElement>document.getElementById('seek-slider'));
            const setSliderMax = () => {
                seekSlider.max = String(Math.floor(audioobject.duration));

                seekSlider.addEventListener('change', () => {
                    audioobject.currentTime = Number(seekSlider.value);
                });
            }
            audioobject.addEventListener('timeupdate', function () {
                setSliderMax();
                seekSlider.value = String(Math.floor(audioobject.currentTime));
                var duration = audioobject.duration;
                var currentTime = audioobject.currentTime;
                document.getElementById('duration-song').innerHTML = fmtMSS(duration);
                document.getElementById('current-time').innerText = fmtMSS(currentTime);
            });
            function fmtMSS(s) {
                var timer = Math.floor(s);
                return (timer - (timer %= 60)) / 60 + (9 < timer ? ':' : ':0') + timer
            }

        } else {

            clickPlayer.classList.remove('fa-pause');
            clickPlayer.classList.add('fa-play');
            audioobject.pause()

        }

    }

    redirect() {
        var sound_song = localStorage.getItem('sound_song')
        let song = JSON.parse(sound_song);
        this.artistId = song.album.artist._id
        this._router.navigate(['/artist/' + this.artistId])
    }

    changevolume(amount) {

        const volumenSong = amount.target.value;
        var audioobject = document.getElementsByTagName("audio")[0];
        audioobject.volume = volumenSong;
        localStorage.setItem('volumen-save', volumenSong)

    }



}