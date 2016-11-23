import { Component, ViewChild, AfterViewInit, ElementRef, Input} from '@angular/core';
import { LoginService } from './login-service';
@Component({
    selector: 'login',
    templateUrl:'loginTemplate'
})
export class AppComponent implements AfterViewInit {
    @ViewChild('emailBox') inputEmail;
    @ViewChild('pwdBox') inputPwd;

    @Input() email: string;
    @Input() password: string;

    message: string;
    processing: boolean;

    // constructor, login service injected in
    constructor(private loginService: LoginService) { }

    // implementation of AfterViewInit, focus on the email input box
    ngAfterViewInit() {
        this.inputEmail.nativeElement.focus();
    }

    emailKeyup(e) {
        if (e.keyCode == 13) {
            if (!this.email) return;
            if (!this.password)
                return this.inputPwd.nativeElement.focus();
            this.login();
        }
    }

    pwdKeyup(e) {
        if (e.keyCode == 13) {
            if (!this.password) return;
            if (!this.email || !this.email.trim())
                return this.inputEmail.nativeElement.focus();
            this.login();
        }
    }

    // validate user and login
    login() {
        this.message = '';
        this.processing = true;
        this.loginService.validateUser(this.email.trim(), this.password)
            .subscribe(result => {
                if (result.msg) {
                    this.processing = false;
                    this.message = result.msg;
                }
                else if (result.url)
                    location.href = result.url;
            },
            err => {
                this.processing = false;
                this.message = err;
            }
        );
    }
}
