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

  IDdata:any={};
  IDname:string='';
  IDgender:string='';
  IDculture:string='';
  IDborn:string='';
  IDdied:string='';
  IDtitles:string[];
  IDaliases:string[];
  IDtvSeries:string[];
  IDplayedBy:string[];


  found:boolean;
  showHide:boolean;
  ID:string='';
  user: FirebaseUserModel = new FirebaseUserModel();
  books:Array<any>;
  characters:Array<any>;
  houses:Array<any>;
  private pageBooks:number=1;
  private pageChars:number=1;
  private pageHouse:number=1;
  pagesBooks:Array<number>;
  pagesChars:Array<number>;
  pagesHouses:Array<number>;
  isDisabled:boolean;


  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location : Location,
    private _http: HttpClient,
    private router: Router,
  ) {
    this.getCharactersByID();
    this.route.params.subscribe(params =>{
      console.log(params);
    })
   }
   
  setCharacterPageFurther(){
    this.pageChars=this.pageChars+1;
    this.getAllCharacters(this.pageChars);
  }
  setCharacterPageBack(){
    this.pageChars=this.pageChars-1;
    this.getAllCharacters(this.pageChars);
  }
  setHousesPageBack(){
    if(this.pageHouse=0){
      this.isDisabled=true;
    }
    this.pageHouse=this.pageHouse-1;
    this.getAllHouses(this.pageHouse);
  }
  setHousesrPageFurther(){
    this.pageHouse=this.pageHouse+1;
    this.getAllHouses(this.pageHouse);
  }

  onNameKeyUp(event:any){
    this.name = event.target.value;
    this.found=false;
    console.log(this.name);
  }

  onIDKeyUp(event:any){
    this.ID = event.target.value;
    this.found=false;
    console.log(this.ID);
  }

  getCharactersByID(){
    this._http.get(this.ROOT_URL+'/characters/'+this.ID).subscribe(
      data =>{
        this.IDdata=data;
        //data in een andere array steken om dan de info er uit te halen
        var res = [];
        for (var x in data){
        data.hasOwnProperty(x) && res.push(data[x])
        }
        console.log(res);
        this.IDname=res[1];
        this.IDgender=res[2];
        this.IDculture=res[3];
        this.IDborn=res[4];
        this.IDdied=res[5];
        this.IDtitles=res[6];
        this.IDaliases=res[7];
        this.IDtvSeries=res[14];
        this.IDplayedBy=res[15];
      }
    )
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

  getAllBooks(pageBooks:number){
    this.resourse="Books"
    this._http.get(this.ROOT_URL+'/books?page='+pageBooks)
    .subscribe(
      (data:any[]) =>{
       console.log(data);
       this.books=data;
      })
  }
  getAllCharacters(pageChars:number){
    this.resourse="Characters"
    this._http.get(this.ROOT_URL+'/characters?page='+this.pageChars)
    .subscribe(
      (data:any[]) =>{
        console.log(data);
        this.characters=data;
      })
  }
  private newMethod() {
    return this;
  }

  getAllHouses(pageHouse:number){
    this.resourse="Houses"
    this._http.get(this.ROOT_URL+'/houses?page='+pageHouse)
    .subscribe(
      (data:any[]) =>{
        console.log(data);
        this.houses=data;
        this.pagesHouses=new Array(data['totalPages']);
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
