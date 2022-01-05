export class Usuario {
    password: string;
    username: string;

    public; constructor(init?: Partial<Usuario>) {
        Object.assign(this, init);
    }
}
