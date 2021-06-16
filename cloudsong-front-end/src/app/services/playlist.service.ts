import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GLOBAL } from './global';
import { Album } from '../models/album.model';
import { PlaylistAddComponent } from '../components/playlist-add.component';
import { Playlist } from '../models/playlist.model';

@Injectable()
export class PlaylistService {
    public url: string;

    constructor(
        private http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }

    editPlaylist(token, id:string, playlist:Playlist){
        
        let params = JSON.stringify(playlist);
    
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });
        console.log(this.url, 'playlist/' + id)
        return this.http.put(this.url+'playlist-edit/' + id, params, {headers: headers})
        .pipe(map(res => res));
    
    }

    addPlaylist(token, playlist:Playlist, userId){
        let params = JSON.stringify(playlist);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        })
        return this.http.post(this.url+'playlist/' + userId, params, {headers: headers})
        .pipe(map(res => res));
    }

    getPlaylist(token, plalistId){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization':token,
        });

         return this.http.get(this.url+'playlist/'+plalistId, {headers: headers})
         .pipe(map(res => res));
    }
    
    getPlaylists(token, userId){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization':token,
        });

         return this.http.get(this.url+'playlists/'+userId, {headers: headers})
         .pipe(map(res => res));
    }

    deletePlaylist(token, playlistId){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization':token,
        });

         return this.http.delete(this.url+'playlist/'+playlistId, {headers: headers})
         .pipe(map(res => res));
    }

    addSongtoPlaylist(songId,playlistId){
                
        let params = new HttpParams()
        .set('song', songId)
        
         return this.http.put(this.url+'playlist/'+playlistId, params)
         .pipe(map(res => res));
    }

    deleteSongFromPlaylist(playlistId, songId){
        let params = new HttpParams()
        .set('song', songId)
        
         return this.http.put(this.url+'delete-song/'+playlistId, params)
         .pipe(map(res => res));
    }


}