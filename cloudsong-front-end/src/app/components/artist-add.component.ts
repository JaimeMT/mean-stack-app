import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Artist } from '../models/artist.model';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';

@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit {

    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;
    
    constructor(
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
        this.is_edit=false;
    }

    ngOnInit() {


        
    }

    onSubmit() {

        this._artistService.addArtist(this.token, this.artist).subscribe(
            res => {
                
                if(!res['artist']){
                    this.alertMessage = "Error en el servidor";
                }else{
                    this.alertMessage = "El artista se registro correctamente";
                    this.artist = res['artist'];

                    this._router.navigate(['/edit-artist/'+ res['artist']._id])
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
