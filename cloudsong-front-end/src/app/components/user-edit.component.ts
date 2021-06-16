import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { GLOBAL } from '../services/global';
import { Router } from '@angular/router'

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit {
    public title: string;
    public user: User;
    public identity;
    public token;
    public alertMessage;
    public fileUpload: Array<File>;
    public url: string;

    constructor(
        private _userService: UserService,
        private _router: Router
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.title = 'Actualizar mis datos';
        this.url = GLOBAL.url;
    }

    ngOnInit() {

        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    

    }

    onSubmit() {
       

        this._userService.updateUser(this.user).subscribe(
            res => {
                if (!res['user']) {
                    this.alertMessage = "El usuario no se ha actuaizado";
                } else {
                    this.user = res['user'];
                    localStorage.setItem('identity', JSON.stringify(res['user']));
                    this.alertMessage = "Usuario actualizado";
                    document.getElementById('nameId').innerHTML = this.user.name;

                    if(!this.fileUpload){
                        
                    }else{
                        this.fileRequest(this.url + 'upload-img-user/' + this.user._id, [], this.fileUpload)
                        .then(
                            (result: any) => {

                                this.user.image = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));
                             
                                let path = this.url + 'get-image-user/'+this.user.image;
                              
                                document.getElementById('imageUser').setAttribute('src', path);

                            }
                        )
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
    }

    logout() {

        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        localStorage.removeItem('sound_playlist');
        localStorage.removeItem('sound_song');
        localStorage.clear();
        this.identity = null;
        this.token = null;
        
        window.location.reload();
        
        
    }

    fileChangeEvent(fileInput: any){
        this.fileUpload = <Array<File>>fileInput.target.files;
    }

    fileRequest(url:string , params: Array<string>, files:Array<File>){
         var token = this.token;

         return new Promise(function(res, rej){
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();
            
            for(var i = 0; i<files.length;i++){
                formData.append('image', files[i], files[i].name);
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