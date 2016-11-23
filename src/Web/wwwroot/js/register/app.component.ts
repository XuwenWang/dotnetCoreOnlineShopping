import { Component, ViewChild, AfterViewInit, ElementRef, Input} from '@angular/core';
import { RegisterService } from './register-service';
@Component({
    selector: 'register',
    templateUrl: 'registerTemplate'
})
export class AppComponent implements AfterViewInit {
    @ViewChild('emailBox') inputEmail;
    @ViewChild('confirmEmailBox') inputConfirmEmail;
    @ViewChild('nameBox') inputName;
    @ViewChild('pwdBox') inputPwd;
    @ViewChild('confirmPwdBox') inputConfirmPwd;

    @Input() email: string = '';
    @Input() confirmEmail: string = '';
    @Input() name: string = '';
    @Input() password: string = '';
    @Input() confirmPassword: string = '';

    message: string;
    processing: boolean;
    registered: boolean;

    // constructor, register service injected
    constructor(private registerService: RegisterService) {
    }

    // implementation of AfterViewInit, focus on email input box
    ngAfterViewInit() {
        this.inputEmail.nativeElement.focus();
    }

    emailKeyup(e) {
        if (e.keyCode == 13) {
            if (!this.email) return;
            return this.inputConfirmEmail.nativeElement.focus();
        }
    }

    confirmEmailKeyup(e) {
        if (e.keyCode == 13) {
            if (!this.confirmEmail) return;
            return this.inputName.nativeElement.focus();
        }
    }

    nameKeyup(e) {
        if (e.keyCode == 13) {
            if (!this.name) return;
            return this.inputPwd.nativeElement.focus();
        }
    }

    pwdKeyup(e) {
        if (e.keyCode == 13) {
            if (!this.password) return;
            return this.inputConfirmPwd.nativeElement.focus();
        }
    }
    confirmPwdKeyup(e) {
        if (e.keyCode == 13) {
            if (!this.confirmPassword) return;
            if (this.valid())
                this.register();
        }
    }

    // check if inputs are valid
    valid() {
        return this.email && this.email.trim()
            && this.confirmEmail && this.confirmEmail.trim()
            && this.email.trim().toLowerCase() == this.confirmEmail.trim().toLowerCase()
            && this.name && this.name.trim()
            && this.password
            && this.confirmPassword == this.password;
    }

    // register a new user
    register() {
        this.message = '';
        this.processing = true;
        this.registerService.registerUser(this.email.trim(), this.name.trim(), this.password)
            .subscribe(result => {
                if (result.msg) {
                    this.processing = false;
                    this.message = result.msg;
                }
                else {
                    this.registered = true;
                }
            },
            err => {
                this.processing = false;
                this.message = err;
            }
        );
    }
}
