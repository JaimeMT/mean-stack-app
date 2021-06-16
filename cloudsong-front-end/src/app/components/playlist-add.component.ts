import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Playlist } from '../models/playlist.model';
import { PlaylistService } from '../services/playlist.service';

@Component({
    selector: 'playlist-add',
    templateUrl: '../views/playlist-add.html',
    providers: [UserService, PlaylistService]
})

export class PlaylistAddComponent implements OnInit {
    public title;
    public playlist: Playlist;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public filesToUpload: Array<File>;
    public is_edit
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _playlistService: PlaylistService
    ) {
        this.title = "Crear playlist"
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.playlist = new Playlist('', '', 2021, '', '', '');
        this.is_edit = false;
    }
    ngOnInit() {
        this.title = "Crear playlist"
    }

    onSubmit() {

        this._playlistService.addPlaylist(this.token, this.playlist, this.identity._id).subscribe(
            res => {

                if (!res['playlist']) {
                    this.alertMessage = "Error en el servidor";
                } else {
                    this.alertMessage = "La playlist se creo correctamente";
                    this.playlist = res['playlist'];

                    this._router.navigate(['/edit-playlist/' + this.playlist['_id']])
                }
            },
            error => {
                var errorMessage = <any>error;
                if (errorMessage != null) {

                    this.alertMessage = error['error']['message'];

                }
            }
        )

    }
}
