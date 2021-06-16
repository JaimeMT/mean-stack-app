import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Playlist } from '../models/playlist.model';
import { PlaylistService } from '../services/playlist.service';
import { UploadService } from '../services/upload.service';

@Component({
    selector: 'playlist-edit',
    templateUrl: '../views/playlist-add.html',
    providers: [UserService, PlaylistService, UploadService]
})

export class PlaylistEditComponent implements OnInit {
    public title;
    public playlist: Playlist;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public filesToUpload: Array<File>;
    public is_edit;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _playlistService: PlaylistService,
        private _uploadService: UploadService
    ) {
        this.title = "Editar Playlist"
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.playlist = new Playlist('', '', 2021, '', '', '');
        this.is_edit =true
    }
    ngOnInit() {
        this.getPlaylist();
    }

    getPlaylist() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._playlistService.getPlaylist(this.token, id).subscribe(
                res => {
                    console.log(res)
                    if (!res['playlistStored']) {
                        this._router.navigate(['/']);
                    } else {

                        this.playlist = res['playlistStored'];
                        console.log(this.playlist.user)
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

    onSubmit() {

        this._route.params.forEach((params: Params) => {
            let id = params['id'];


            this._playlistService.editPlaylist(this.token, id, this.playlist).subscribe(
                res => {
                    console.log(res)
                    if (!res['playlist']) {
                        this.alertMessage = "Error en el servidor";
                    } else {
                        this.alertMessage = "El album se edito correctamente";
                        if (!this.filesToUpload) {
                            this._router.navigate(['/playlist', res['playlist']._id]);
                        } else {
                            this._uploadService.fileRequest(this.url + 'upload-image-playlist/' + id, [], this.filesToUpload, this.token, 'image')
                                .then(
                                    (ressult) => {

                                        this._router.navigate(['/playlist/', res['playlist']._id]);
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
            )

        });

    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}