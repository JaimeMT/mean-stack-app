import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Playlist } from '../models/playlist.model';
import { PlaylistService } from '../services/playlist.service';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';

@Component({
    selector:'biblioteca-app',
    templateUrl:'../views/biblioteca.html',
    providers: [UserService, PlaylistService]
})

export class BibliotecaComponent implements OnInit{
    public title:string;
    public identity;
    public playlists: Playlist[]
    public token;
    public url;
    public confirmado;

    constructor(
        
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _playlistService: PlaylistService
    ){
        this.url = GLOBAL.url;
        this.title = 'Biblioteca';
        this.identity = _userService.getIdentity();
        this.token = this._userService.getToken();
    }

    ngOnInit(){

        this.getPlaylists();

    }

    getPlaylists(){

        this._playlistService.getPlaylists(this.token, this.identity._id).subscribe(
            res => {
                if (!res['playlists']) {
                    this._router.navigate(['/']);
                } else {
                    this.playlists = res['playlists'];
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

    onDeleteConfirm(id){
        
        this.confirmado = id;
      

    }

    onCancelAlbum(){
        this.confirmado = null;
    }

    onDeletePlaylist(){
        
        this._playlistService.deletePlaylist(this.token, this.confirmado).subscribe(
            res => {

                if (!res['playlist']) {
                    alert("error en el servidor")
                    this._router.navigate(['/mi-biblioteca'+this.identity._id]);
                }
                    this.getPlaylists();
                
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