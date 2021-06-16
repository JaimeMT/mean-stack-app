import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Artist } from '../models/artist.model';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { UploadService } from '../services/upload.service';

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit {
    public title: string;
    public artist: Artist;
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
        private _artistService: ArtistService,
        private _uploadService: UploadService
    ) {
        this.title = 'Registrar nuevo artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
        this.is_edit = true;
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
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    if (errorMessage != null) {

                        //this.alertMessage = error['error']['message'];

                    }
                }
            )
        });
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._artistService.updateArtist(this.token, id, this.artist).subscribe(
                res => {

                    if (!res['artist']) {
                        this.alertMessage = "Error en el servidor";
                    } else {

                        this.alertMessage = "El artista se actualizo correctamente";
                        if (!this.filesToUpload) {
                            this._router.navigate(['/artist', res['artist']._id]);
                        } else {
                            this._uploadService.fileRequest(this.url + 'upload-image-artist/' + id, [], this.filesToUpload, this.token, 'image')
                                .then(
                                    (ressult) => {
                                        this._router.navigate(['/artist', res['artist']._id]);
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
        });

    }


    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}