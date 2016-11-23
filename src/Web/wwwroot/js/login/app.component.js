"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var AppComponent = (function () {
    // constructor, login service injected in
    function AppComponent(loginService) {
        this.loginService = loginService;
    }
    // implementation of AfterViewInit, focus on the email input box
    AppComponent.prototype.ngAfterViewInit = function () {
        this.inputEmail.nativeElement.focus();
    };
    AppComponent.prototype.emailKeyup = function (e) {
        if (e.keyCode == 13) {
            if (!this.email)
                return;
            if (!this.password)
                return this.inputPwd.nativeElement.focus();
            this.login();
        }
    };
    AppComponent.prototype.pwdKeyup = function (e) {
        if (e.keyCode == 13) {
            if (!this.password)
                return;
            if (!this.email || !this.email.trim())
                return this.inputEmail.nativeElement.focus();
            this.login();
        }
    };
    // validate user and login
    AppComponent.prototype.login = function () {
        var _this = this;
        this.message = '';
        this.processing = true;
        this.loginService.validateUser(this.email.trim(), this.password)
            .subscribe(function (result) {
            if (result.msg) {
                _this.processing = false;
                _this.message = result.msg;
            }
            else if (result.url)
                location.href = result.url;
        }, function (err) {
            _this.processing = false;
            _this.message = err;
        });
    };
    __decorate([
        core_1.ViewChild('emailBox')
    ], AppComponent.prototype, "inputEmail", void 0);
    __decorate([
        core_1.ViewChild('pwdBox')
    ], AppComponent.prototype, "inputPwd", void 0);
    __decorate([
        core_1.Input()
    ], AppComponent.prototype, "email", void 0);
    __decorate([
        core_1.Input()
    ], AppComponent.prototype, "password", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'login',
            templateUrl: 'loginTemplate'
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
