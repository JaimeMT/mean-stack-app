import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Artist } from '../models/artist.model';
import { Album } from '../models/album.model';
import { Song } from '../models/song.model';

@Injectable()
export class SongService {
    public url: string;

    constructor(
        private http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }

    addSong(token, song: Song) {
        let params = JSON.stringify(song);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        })
        return this.http.post(this.url + 'song/', params, { headers: headers })
            .pipe(map(res => res));
    }

    editSong(token, songId: string, song: Song) {

        let params = JSON.stringify(song);

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this.http.put(this.url + 'song/' + songId, params, { headers: headers })
            .pipe(map(res => res));

    }

    getSong(token, songId: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        return this.http.get(this.url + 'song/' + songId, options).pipe(map(res => res));
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

    getSongs(token, albumId = null) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        if (albumId == null) {
            return this.http.get(this.url + 'songs/', options).pipe(map(res => res));
        } else {
            return this.http.get(this.url + 'songs/' + albumId, options).pipe(map(res => res));
        }

    }

    deleteSong(token, songId: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = {
            headers: headers
        };

        return this.http.delete(this.url + 'song/' + songId, options).pipe(map(res => res));
    }

}