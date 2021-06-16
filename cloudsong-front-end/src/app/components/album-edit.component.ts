import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Album } from '../models/album.model';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';

@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit {

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
        private _albumService: AlbumService,
        private _uploadService: UploadService
    ) {
        
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', 2021, '', '');
        this.is_edit = true;
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


                    }
                },
                error => {
                    var errorMessage = <any>error;
                    if (errorMessage != null) {

                        this.alertMessage = error['error']['message'];

                    }
                }
            )
        })
    }

    onSubmit() {

        this._route.params.forEach((params: Params) => {
            let id = params['id'];


            this._albumService.editAlbum(this.token, id, this.album).subscribe(
                res => {
                
                    if (!res['album']) {
                        this.alertMessage = "Error en el servidor";
                    } else {
                        this.alertMessage = "El album se edito correctamente";
                        if (!this.filesToUpload) {
                            this._router.navigate(['/artist', res['album'].artist]);
                        } else {
                            this._uploadService.fileRequest(this.url + 'upload-image-album/' + id, [], this.filesToUpload, this.token, 'image')
                                .then(
                                    (ressult) => {

                                        this._router.navigate(['/artist', res['album'].artist]);
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
