"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var AppComponent = (function () {
    // constructor, register service injected
    function AppComponent(registerService) {
        this.registerService = registerService;
        this.email = '';
        this.confirmEmail = '';
        this.name = '';
        this.password = '';
        this.confirmPassword = '';
    }
    // implementation of AfterViewInit, focus on email input box
    AppComponent.prototype.ngAfterViewInit = function () {
        this.inputEmail.nativeElement.focus();
    };
    AppComponent.prototype.emailKeyup = function (e) {
        if (e.keyCode == 13) {
            if (!this.email)
                return;
            return this.inputConfirmEmail.nativeElement.focus();
        }
    };
    AppComponent.prototype.confirmEmailKeyup = function (e) {
        if (e.keyCode == 13) {
            if (!this.confirmEmail)
                return;
            return this.inputName.nativeElement.focus();
        }
    };
    AppComponent.prototype.nameKeyup = function (e) {
        if (e.keyCode == 13) {
            if (!this.name)
                return;
            return this.inputPwd.nativeElement.focus();
        }
    };
    AppComponent.prototype.pwdKeyup = function (e) {
        if (e.keyCode == 13) {
            if (!this.password)
                return;
            return this.inputConfirmPwd.nativeElement.focus();
        }
    };
    AppComponent.prototype.confirmPwdKeyup = function (e) {
        if (e.keyCode == 13) {
            if (!this.confirmPassword)
                return;
            if (this.valid())
                this.register();
        }
    };
    // check if inputs are valid
    AppComponent.prototype.valid = function () {
        return this.email && this.email.trim()
            && this.confirmEmail && this.confirmEmail.trim()
            && this.email.trim().toLowerCase() == this.confirmEmail.trim().toLowerCase()
            && this.name && this.name.trim()
            && this.password
            && this.confirmPassword == this.password;
    };
    // register a new user
    AppComponent.prototype.register = function () {
        var _this = this;
        this.message = '';
        this.processing = true;
        this.registerService.registerUser(this.email.trim(), this.name.trim(), this.password)
            .subscribe(function (result) {
            if (result.msg) {
                _this.processing = false;
                _this.message = result.msg;
            }
            else {
                _this.registered = true;
            }
        }, function (err) {
            _this.processing = false;
            _this.message = err;
        });
    };
    __decorate([
        core_1.ViewChild('emailBox')
    ], AppComponent.prototype, "inputEmail", void 0);
    __decorate([
        core_1.ViewChild('confirmEmailBox')
    ], AppComponent.prototype, "inputConfirmEmail", void 0);
    __decorate([
        core_1.ViewChild('nameBox')
    ], AppComponent.prototype, "inputName", void 0);
    __decorate([
        core_1.ViewChild('pwdBox')
    ], AppComponent.prototype, "inputPwd", void 0);
    __decorate([
        core_1.ViewChild('confirmPwdBox')
    ], AppComponent.prototype, "inputConfirmPwd", void 0);
    __decorate([
        core_1.Input()
    ], AppComponent.prototype, "email", void 0);
    __decorate([
        core_1.Input()
    ], AppComponent.prototype, "confirmEmail", void 0);
    __decorate([
        core_1.Input()
    ], AppComponent.prototype, "name", void 0);
    __decorate([
        core_1.Input()
    ], AppComponent.prototype, "password", void 0);
    __decorate([
        core_1.Input()
    ], AppComponent.prototype, "confirmPassword", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'register',
            templateUrl: 'registerTemplate'
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
