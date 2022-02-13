import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-restrablecer-contrasena',
  templateUrl: './restrablecer-contrasena.component.html',
  styleUrls: ['./restrablecer-contrasena.component.scss']
})
export class RestrablecerContrasenaComponent implements OnInit, OnDestroy {

  private recuperarPassSubscription: Subscription;

  recibeEmail: string;

  ngFormRecuperaPass: FormGroup;

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {
    this.createngFormRecuperaPass();
  }

  ngOnInit(): void {
  }

  restablecerContrasena() {
    this.recibeEmail = this.ngFormRecuperaPass.get('email').value;
    this.recuperarPassSubscription = this.loginService.recuperarPassword(this.recibeEmail).subscribe(pass => {
      if (pass == true) {
        setTimeout(() =>
          swal.fire('Solicitud exitosa!', '<span><b><div class="alert alert-success" role="alert">Contraseña restablecida correctamente. Revisar la casilla de correo, le llegará una notificación sobre el cambio de contraseña.' + '</div></b></span>', 'success'), 1000);
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 100);
      } else {
        swal.fire(
          'Error',
          '<span><b><div class="alert alert-danger" role="alert">' +
          'Hubo un error al restablecer la contraseña!' +
          '</div></b></span>',
          'error'
        )
      }
    },
      err => {
        swal.fire(
          'Error',
          '<span><b><div class="alert alert-danger" role="alert">' +
          `${err.error.mensaje}` +
          '</div></b></span>',
          'error'
        )
      },
    )
  }

  volver() {
    setTimeout(() => {
      this.router.navigate(['login']);
    }, 100);
  }

  createngFormRecuperaPass() {
    this.ngFormRecuperaPass = new FormGroup({
      email: new FormControl("", [Validators.required])
    })
  }

  ngOnDestroy(): void {
    if (this.recuperarPassSubscription) {
      this.recuperarPassSubscription.unsubscribe();
    }
  }

}
