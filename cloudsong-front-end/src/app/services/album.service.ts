import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Artist } from '../models/artist.model';
import { Album } from '../models/album.model';

@Injectable()
export class AlbumService {
    public url: string;

    constructor(
        private http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }

    addAlbum(token, album:Album){
        let params = JSON.stringify(album);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        })
        return this.http.post(this.url+'album/', params, {headers: headers})
        .pipe(map(res => res));
    }

    editAlbum(token, id:string, album:Album){
    
        let params = JSON.stringify(album);
    
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        return this.http.put(this.url+'album/' + id, params, {headers: headers})
        .pipe(map(res => res));
    
    }
    
    getAlbums(token, artistId = null){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });
    
        let options = {
            headers: headers
         };
         if(artistId == null){
            return this.http.get(this.url + 'albums/', options)
                .pipe(map(res => res));
         }else{
            return this.http.get(this.url + 'albums/' + artistId, options)
                .pipe(map(res => res));
         }
    }

    getAlbum(token, id:string){
    
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });
    
        let options = {
            headers: headers
         };

        return this.http.get(this.url + 'album/' + id, options)
         .pipe(map(res => res));
    }

    deleteAlbum(token, id:string){
    
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });
    
        let options = {
            headers: headers
         };

        return this.http.delete(this.url + 'album/' + id, options)
         .pipe(map(res => res));
    }
    
}