import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public hide: boolean = false;
  public showEye: Boolean = false;
  public hideConf: boolean = false;
  public showEyeConf: Boolean = false;

  username: string;
  password: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  iniciarSesion() {
    console.log('Inicio sesión!');
    setTimeout(() => {
      this.router.navigate(['catalogo']);
    }, 2000);
  }

  mostrarPassword() {
    this.hide = !this.hide;
    this.showEye = !this.showEye;
  }

}
