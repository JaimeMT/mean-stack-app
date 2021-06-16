import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Artist } from '../models/artist.model';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Album } from '../models/album.model';
import { AlbumService } from '../services/album.service';

@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit {
    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService
    ) {

        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', 2021, '', '');
        this.is_edit = false;
    }
    ngOnInit() {

    }

    onSubmit() {

        this._route.params.forEach((params: Params) => {
            let artist_id = params['artist'];
            this.album.artist = artist_id;

            this._albumService.addAlbum(this.token, this.album).subscribe(
                res => {

                    if (!res['album']) {
                        this.alertMessage = "Error en el servidor";
                    } else {
                        this.alertMessage = "El album se creo correctamente";
                        this.album = res['album'];

                        this._router.navigate(['/edit-album/' + res['album']._id])
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
}
