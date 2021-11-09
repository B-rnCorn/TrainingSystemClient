import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  @Input('currentTab')
  public currentTab: string = '';

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  public navigate(path: string){
    console.log(path);
    this.router.navigate([path]);
  }

}
