import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Artist } from '../models/artist.model';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';


@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit {
    public title: string;
    public artists: Artist[];
    public identity;
    public token;
    public url: string;
    public next_page;
    public prev_page;
    public confirmado;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ) {
        this.title = 'Artistas';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.next_page = 1;
        this.prev_page = 1;
    }

    ngOnInit() {

        this.getArtist();
    
    }

    getArtist() {
        this._route.params.forEach((params: Params) => {
            let page = +params['page'];
            if (!page) {
                page = 1;
            } else {
                this.next_page = page + 1;
                this.prev_page = page - 1;

                if (this.prev_page == 0) {
                    this.prev_page = 1;
                }

            }

            this._artistService.getArtists(this.token, page).subscribe(
                res => {
                    if (!res['artists']) {
                        this._router.navigate(['/']);
                    } else {
                        this.artists = res['artists'];
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

    onDeleteConfirm(id){
        this.confirmado = id;

    }

    onCancel(){
        this.confirmado = null;
    }

    onDeleteArtist(id){

        this._artistService.deleteArtist(this.token, this.confirmado).subscribe(
            res => {
     
                if (!res['artist']) {
                    alert("error en el servidor")
                    this._router.navigate(['/']);
                }
                    this.getArtist();
                
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