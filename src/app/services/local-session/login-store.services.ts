import { EventEmitter, Injectable, Output } from '@angular/core';
import { Login } from 'src/app/model/login';

@Injectable({
  providedIn: 'root'
})
export class LoginStoreService {
  
  constructor() { }

  static readonly USER_LOGIN = 'login';

  public guardarLogin(userLogin: Login): void {
      sessionStorage.setItem(LoginStoreService.USER_LOGIN, JSON.stringify(userLogin));
    }
  
    public obtenerLogin(): any {
      const login: any = JSON.parse(sessionStorage.getItem(LoginStoreService.USER_LOGIN));
      return login;
    }
  
    public borrarLogin(): void {
      sessionStorage.removeItem(LoginStoreService.USER_LOGIN);
    }
}
