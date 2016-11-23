"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var AppComponent = (function () {
    // basketService injected here
    function AppComponent(basketService) {
        var _this = this;
        this.basketService = basketService;
        this.products = [];
        this.basketService.getProducts()
            .subscribe(function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var p = data_1[_i];
                _this.products.push(p);
            }
        });
    }
    // update a product's quantity by delta (+1 or -1)
    AppComponent.prototype.updateQuantity = function (p, delta) {
        var _this = this;
        // cannot change the quantity to zero
        if (p.quantity + delta < 1 || this.updating)
            return;
        this.updating = true;
        this.basketService.updateQuantity(p.id, p.quantity + delta)
            .subscribe(function (data) {
            p.quantity += delta;
            p.total = p.quantity * p.unitPrice;
            _this.updating = false;
        });
    };
    // remove the product from basket
    AppComponent.prototype.removeProduct = function (p) {
        var _this = this;
        this.updating = true;
        this.basketService.removeProduct(p.id)
            .subscribe(function (data) {
            for (var i = 0; i < _this.products.length; i++) {
                if (_this.products[i].id == p.id) {
                    _this.products.splice(i, 1);
                    break;
                }
            }
            _this.updating = false;
        });
    };
    // place an order against the given product
    AppComponent.prototype.placeOrder = function (p) {
        var _this = this;
        if (this.updating)
            return;
        this.updating = true;
        this.basketService.placeOrder(p.id)
            .subscribe(function (data) {
            for (var i = 0; i < _this.products.length; i++) {
                if (_this.products[i].id == p.id) {
                    _this.products.splice(i, 1);
                    break;
                }
            }
            _this.updating = false;
        });
    };
    // palce an order against all products in basket
    AppComponent.prototype.placeAllOrder = function () {
        var _this = this;
        if (this.updating)
            return;
        this.updating = true;
        this.basketService.placeAllOrder()
            .subscribe(function (data) {
            _this.products = [];
            _this.updating = false;
        });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-basket',
            templateUrl: 'baskettemplate'
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
