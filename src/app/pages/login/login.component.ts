import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators, FormsModule, FormControl } from '@angular/forms';

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

  username: string = '';
  password: string = '';

  ngForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { this.createForm(); }

  ngOnInit(): void {
  }

  iniciarSesion() {
    
    setTimeout(() => {
      this.router.navigate(['catalogo']);
    }, 2000);
  }

  mostrarPassword() {
    this.hide = !this.hide;
    this.showEye = !this.showEye;
  }

  createForm() {
    this.ngForm = this.formBuilder.group({
       user: new FormControl("", [Validators.required, Validators.minLength(5)]),
       password: new FormControl("", [Validators.required, Validators.minLength(5)]),
    });
  }

}
