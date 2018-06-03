import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FirebaseUserModel } from '../core/user.model';
import {HttpClient, HttpHeaders,} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

  readonly ROOT_URL = '/api';
  resourse:string='';
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
  showHide:boolean;

  user: FirebaseUserModel = new FirebaseUserModel();
  books:Array<any>;
  characters:Array<any>;
  houses:Array<any>;
  private page:number=0;
  pages:Array<number>;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location : Location,
    private _http: HttpClient,
    private router: Router,
  ) {
    this.route.params.subscribe(params =>{
      console.log(params);
    })
   }

  onNameKeyUp(event:any){
    this.name = event.target.value;
    this.found=false;
    console.log(this.name);
  }
 
  getCharacters(){
    this.router.navigate(['user',{term: this.name}])
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

  getAllBooks(page:number){
    this.resourse="Books"
    this._http.get(this.ROOT_URL+'/books?page='+page)
    .subscribe(
      (data:any[]) =>{
       console.log(data);
       this.books=data;
       this.pages=new Array(data['totalPages']);
      }
      )
  }
  getAllCharacters(page:number){
    this.resourse="Characters"
    this._http.get(this.ROOT_URL+'/characters?page='+page)
    .subscribe(
      (data:any[]) =>{
        console.log(data);
        this.characters=data;
        this.pages=new Array(data['totalPages']);
      }
      )
  }
  getAllHouses(page:number){
    this.resourse="Houses"
    this._http.get(this.ROOT_URL+'/houses?page='+page)
    .subscribe(
      (data:any[]) =>{
        console.log(data);
        this.houses=data;
        this.pages=new Array(data['totalPages']);
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

  logout(){
    this.authService.doLogout()
    .then((res) => {
      this.location.back();
    }, (error) => {
      console.log("Logout error", error);
    });
  }

}
