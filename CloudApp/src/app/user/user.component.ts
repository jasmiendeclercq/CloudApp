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
  readonly ROOT_URL = '/api';
  name:string='';
  gender:string='';
  culture:string='';
  born:string='';
  died:string='';
  titles:string[];
  aliases:string[];
  tvSeries:string[];
  playedBy:string[];
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
    this._http.get(this.ROOT_URL+'/characters/', {params: {name: this.name}})
    .subscribe(
      (data:any[]) =>{
        console.log(data);
        if(data.length){  
          this.name=data[0].name;
          this.gender=data[0].gender;
          this.culture=data[0].culture;
          this.born=data[0].born;
          this.died=data[0].died;
          this.titles=data[0].titles;
          this.aliases=data[0].aliases;
          this.tvSeries=data[0].tvSeries;
          this.playedBy=data[0].playedBy;
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
