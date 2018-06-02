import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FirebaseUserModel } from '../core/user.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  name:string='';
  user: FirebaseUserModel = new FirebaseUserModel();

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location : Location,
    private _http: HttpClient
  ) { }

  onNameKeyUp(event:any){
    this.name = event.target.value;
  }

  getCharacters(){
    //problemen met cors zie website: https://github.com/Rob--W/cors-anywhere
    var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
    this._http.get("https://cors-anywhere.herokuapp.com/https://anapioficeandfire.com/api/characters/583")
    //this._http.get("https://anapioficeandfire.com/api/characters/?name=${this.name}")
    .subscribe(
      (data:any[]) =>{
        console.log(data);
      }
    )

  }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
      }
    })
  }

  save(value){
    this.userService.updateCurrentUser(value)
    .then(res => {
      console.log(res);
    }, err => console.log(err))
  }

  logout(){
    this.authService.doLogout()
    .then((res) => {
      this.location.back();
    }, (error) => {
      console.log("Logout error", error);
    });
  }

}
