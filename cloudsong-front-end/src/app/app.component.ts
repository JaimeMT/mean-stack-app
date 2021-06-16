import { Component, OnInit } from '@angular/core';
import { User } from './models/user.model';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {

  public title = 'CloudSongs';
  public user: User;
  public userRegister: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url;

  constructor(
    private _userService: UserService,
    private _router: Router,
  ) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url;
    

  }

  ngOnInit() {

    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

  }

  onSubmit() {
    console.log("gola")
    this._userService.signup(this.user).subscribe(
      res => {
        let identity = res['user'];
        this.identity = identity;

        if (!this.identity._id) {

          alert("El usuario no esta correctamente identificado");
        } else {
          localStorage.setItem('identity', JSON.stringify(identity));
          this._userService.signup(this.user, 'true').subscribe(
            res => {

              let token = res['token'];
              this.token = token;
              if (res['token'] <= 0) {
                alert("El token no se ha generado");
              } else {
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
                this._router.navigate(['/home']);
                location.reload();
              }
            },
            error => {
              var errorMessage = <any>error;
              if (errorMessage != null) {

                this.errorMessage = error['error']['message'];

              }
            }
          )
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {

          this.errorMessage = error['error']['message'];

        }
      }
    )
  }

  onSubmitRegister() {
   

    this._userService.signin(this.userRegister).subscribe(
      res => {
        let user = res['user'];
        this.userRegister = user;
        console.log(res)
        if (!user._id) {
          this.alertRegister = 'Error al registarse';
        } else {
          this.alertRegister = "Usted esta registrado, identificate con " + this.userRegister.email;
          this.userRegister = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {

          this.alertRegister = error['error']['message'];

        }
      }
    )
  }

}
