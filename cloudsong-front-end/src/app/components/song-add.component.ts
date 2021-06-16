import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Song } from '../models/song.model';
import { GLOBAL } from '../services/global';
import { SongService } from '../services/song.service';
import { UserService } from '../services/user.service';


@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService]
})

export class SongAddComponent implements OnInit {
    public title: string;
    public song: Song;
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
        private _songService: SongService
    ) {
        this.title = 'Crear Cancion';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1, '', '', '', '');
        this.is_edit = false;
    }
    ngOnInit() {

    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let albumId = params['album'];
            this.song.album = albumId;
  

            this._songService.addSong(this.token, this.song).subscribe(
                res => {

                    if (!res['song']) {
                        this.alertMessage = "Error en el servidor";
                    } else {
                        this.alertMessage = "La cancion se registro correctamente";
                        this.song = res['song'];
     
                        this._router.navigate(['/edit-song/' + res['song']._id])
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

    
}
