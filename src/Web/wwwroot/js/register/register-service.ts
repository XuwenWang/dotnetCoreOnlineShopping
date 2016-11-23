import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import './rxjs-operators';

@Injectable()
export class RegisterService {
    private urlRegisterUser: string = 'register';

    // constructor, http service injected
    constructor(private http: Http) { }

    // register a new user
    registerUser(email: string, name:string, password: string) {
        return this.http.post(this.urlRegisterUser, $.param({ email,name, password }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .map(res => res.json());
    }
}
