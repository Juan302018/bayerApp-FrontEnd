import { Usuario } from "../model/usuario";

export class Login {
  mensaje: string;
  token: string;
  user?: Usuario;

  public; constructor(init?: Partial<Login>) {
    Object.assign(this, init);
  }
}
