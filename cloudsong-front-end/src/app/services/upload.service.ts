import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Artist } from '../models/artist.model';

@Injectable()
export class UploadService {
    public url: string;

    constructor(
        private http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }

    fileRequest(url:string , params: Array<string>, files:Array<File>, token:string, name:string){
        console.log(url, params, files, name)
        return new Promise(function(res, rej){
           var formData:any = new FormData();
           var xhr = new XMLHttpRequest();
           
           for(var i = 0; i<files.length;i++){
               formData.append(name, files[i], files[i].name);
               
           }

           xhr.onreadystatechange = function(){
               if(xhr.readyState == 4){
                   if(xhr.status == 200){
                       res(JSON.parse(xhr.response));
                   }else{
                       rej(xhr.response);
                   }   
               }
               
           }
           xhr.open('POST', url, true);
           xhr.setRequestHeader('Authorization', token);
           xhr.send(formData);
        });
   }
}