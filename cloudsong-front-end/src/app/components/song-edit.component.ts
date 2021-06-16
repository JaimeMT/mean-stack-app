import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


import { Song } from '../models/song.model';
import { GLOBAL } from '../services/global';
import { SongService } from '../services/song.service';
import { UploadService } from '../services/upload.service';
import { UserService } from '../services/user.service';


@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit {
    public title: string;
    public song: Song;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;
    public filesToUpload;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
        private _uploadService: UploadService
    ) {
        this.title = 'Editar Cancion';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1, '', '', '', '');

        this.is_edit = true;
    }
    ngOnInit() {

        this.getSong();
    }



    getSong() {
        var infos = document.getElementById('infos');

        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._songService.getSong(this.token, id).subscribe(
                res => {
                    if (!res['song']) {
                        this._router.navigate(['/']);
                    } else {
                        this.song = res['song'];
                        this.song.duration = infos.textContent;
                       
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    if (errorMessage != null) {

                        this.alertMessage = error['error']['message'];

                    }
                }
            )
        });
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
   
            var infos = document.getElementById('infos');
            this.song.duration = infos.textContent;
            this._songService.editSong(this.token, id, this.song).subscribe(
                res => {
              
                    if (!res['song']) {
                        this.alertMessage = "Error en el servidor";
                    } else {
                        this.alertMessage = "La cancion se actualizo correctamente";

                        if (!this.filesToUpload) {
                            this._router.navigate(['/album', res['song'].album]);
                        } else {

                            this._uploadService.fileRequest(this.url + 'upload-file-song/' + id, [], this.filesToUpload, this.token, 'file')
                                .then(
                                    (ressult) => {





                                        this._router.navigate(['/album', res['song'].album]);

                                    },
                                    (error) => {
                                      
                                    }
                                );
                        }
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    if (errorMessage != null) {

                        this.alertMessage = error['error']['message'];

                    }
                }
            );
        })
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
        var mySongs = [];
        window.URL = window.URL || window.webkitURL;
        var infos = document.getElementById('infos');

        var files = this.filesToUpload;


        mySongs.push(files[0]);
        var audio = document.createElement('audio');
        audio.preload = 'metadata';

        audio.onloadedmetadata = function () {
            window.URL.revokeObjectURL(audio.src);
            var duration = audio.duration;
            mySongs[mySongs.length - 1].duration = duration;
            updateInfos();
        }

        audio.src = URL.createObjectURL(files[0]);;



        function updateInfos() {

            infos.textContent = "";
            for (var i = 0; i < mySongs.length; i++) {
                infos.textContent = Math.floor(mySongs[i].duration) + '\n';

            }
            function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}
            infos.textContent = fmtMSS(infos.textContent);
        }


    }

}
