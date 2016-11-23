import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import './rxjs-operators';

@Injectable()
export class LoginService {
    private urlValidateUser: string = 'login';
    constructor(private http: Http) { }

    // vlidate user by email and password
    validateUser(email: string, password: string) {
        return this.http.post(this.urlValidateUser, $.param({ email, password }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .map(res => res.json());
    }
}
