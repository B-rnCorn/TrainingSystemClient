import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TokenService} from "../../../services/token.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  public roles: string[] = this.tokenService.getAuthorities();

  @Input('currentTab')
  public currentTab: string = '';

  constructor(private router: Router, private tokenService: TokenService) { }
  ngOnInit(): void {
  }

  public navigate(path: string){
    console.log(path);
    this.router.navigate([path]);
  }

}
