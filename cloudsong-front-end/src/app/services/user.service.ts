import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { User } from '../models/user.model';

@Injectable()
export class UserService {
    public identity;
    public token;
    public url: string;

    constructor(
        private http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }



    signup(user_to_login, gethash = null) {
        if (gethash != null) {
            user_to_login.gethash = gethash;
        }
        let params = JSON.stringify(user_to_login);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' })

        return this.http.post(this.url + 'login', params, { headers: headers })
            .pipe(map(res => res));

    }

    signin(user_to_register) {

        let params = JSON.stringify(user_to_register);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post(this.url + 'register', params, { headers: headers })
            .pipe(map(res => res));
    }

    updateUser(user_to_update) {
        let params = JSON.stringify(user_to_update);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.getToken()
        });

        return this.http.put(this.url + 'update-user/' + user_to_update._id, params, { headers: headers })
            .pipe(map(res => res));
    }

    
    likeSongUser(user_to_update, songId) {
        
        let params = new HttpParams()
        .set('song', songId);
        

        return this.http.post(this.url + 'mis-canciones/' + user_to_update._id, params)
            .pipe(map(res => res));
    }

    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));
        if (identity != 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

    getToken() {
        let token = localStorage.getItem('token');

        if (token != 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }

        return this.token;
    }
}