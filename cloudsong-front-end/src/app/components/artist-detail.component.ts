import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Artist } from '../models/artist.model';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album.model';
import { SongService } from '../services/song.service';


@Component({
    selector: 'artist-details',
    templateUrl: '../views/artist-details.html',
    providers: [UserService, ArtistService, AlbumService, SongService]
})

export class ArtistDetailComponent implements OnInit {
    public artist: Artist;
    public albums: Album[];
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public filesToUpload: Array<File>;
    public confirmado;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService,
        private _songService: SongService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {

        this.getArtist();

    }

    getArtist() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._artistService.getArtist(this.token, id).subscribe(
                res => {

                    if (!res['artist']) {
                        this._router.navigate(['/']);
                    } else {
                        this.artist = res['artist'];
                        this._albumService.getAlbums(this.token, res['artist']._id).subscribe(
                            res => {
                                this.albums = res['albums'];
                                if (!res['albums']) {
                                    this.alertMessage = "Este artista no tiene albums";
                                } else {
                                    this.albums = res['albums'];
                                }
                            },
                            error => {
                                var errorMessage = <any>error;
                                if (errorMessage != null) {

                                    //this.alertMessage = error['error']['message'];

                                }
                            }
                        );
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    if (errorMessage != null) {

                        this.alertMessage = error['error']['message'];

                    }
                }
            );
        });
    }

    onDeleteConfirm(id) {

        this.confirmado = id;


    }

    onCancelAlbum() {
        this.confirmado = null;
    }

    onDeleteAlbum(artistId) {

        this._albumService.deleteAlbum(this.token, this.confirmado).subscribe(
            res => {

                if (!res['album']) {
                    this.alertMessage = "Error en el servidor"
                } else {
                    this._albumService.getAlbums(this.token, artistId).subscribe(
                        res => {
                            if (!res['albums']) {
                                this.alertMessage = "Error en el servidor"
                            } else {
                                this.albums = res['albums']
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
            },
            error => {
                var errorMessage = <any>error;
                if (errorMessage != null) {

                    //this.alertMessage = error['error']['message'];

                }
            }
        )

    }

}