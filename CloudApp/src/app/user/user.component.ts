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
  gender:string='';
  titles:string[];
  found:boolean;

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
    this.found=false;
    console.log(this.name);
    console.log(this.findAndReplace(this.name, " ", "+"));
    this.name=(this.findAndReplace(this.name, " ", "+"));
  }

  findAndReplace(string, target, replacement) {
    var i = 0, length = string.length; 
    for (i; i < length; i++) {
      string = string.replace(target, replacement);  
    }  
    return string; 
   }
    
   
  getCharacters(){
    this._http.get("/api/characters/?name=Jon+Snow")
   // this._http.get("https://cors-anywhere.herokuapp.com/https://anapioficeandfire.com/api/characters/?name=${this.name}")
   // this._http.get('https://cors-anywhere.herokuapp.com/https://anapioficeandfire.com/api/characters/?culture=valyrian')
    .subscribe(
      (data:any[]) =>{
        console.log(data);
        if(data.length){
          this.name=data[1].name;
          this.found=true;
        }
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
