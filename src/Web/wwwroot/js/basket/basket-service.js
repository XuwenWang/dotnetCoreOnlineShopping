"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var Observable_1 = require('rxjs/Observable');
require('./rxjs-operators');
var BasketService = (function () {
    // constructor, http injected
    function BasketService(http) {
        this.http = http;
        // TODO: replace the following urls with the 3rd party api urls
        // should use the actual 3rd parti api url here
        // for test we use the mocked url instead
        this.urlGetProducts = 'getBasketProducts';
        this.urlUpdateQuantity = 'updateQuantity';
        this.urlRemoveProduct = 'removeProduct';
        this.urlPlaceOrder = 'placeOrder';
        this.urlPlaceAllOrder = 'placeAllOrder';
    }
    // get proudct list of the basket
    BasketService.prototype.getProducts = function () {
        return this.http.get(this.urlGetProducts)
            .map(function (res) { return res.json(); })
            .catch(function (err) { return Observable_1.Observable.throw(err); });
    };
    // change quantity of product
    BasketService.prototype.updateQuantity = function (product, quantity) {
        return this.http.post(this.urlUpdateQuantity, $.param({ productId: product, quantity: quantity }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .map(function (res) { return res.json(); })
            .catch(function (err) { return Observable_1.Observable.throw(err); });
    };
    // remove product from basket
    BasketService.prototype.removeProduct = function (product) {
        return this.http.post(this.urlRemoveProduct, $.param({ productId: product }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .map(function (res) { return res.json(); })
            .catch(function (err) { return Observable_1.Observable.throw(err); });
    };
    // place an order against a product
    BasketService.prototype.placeOrder = function (product) {
        return this.http.post(this.urlPlaceOrder, $.param({ productId: product }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .map(function (res) { return res.json(); })
            .catch(function (err) { return Observable_1.Observable.throw(err); });
    };
    // place an order against all products in basket
    BasketService.prototype.placeAllOrder = function () {
        return this.http.post(this.urlPlaceAllOrder, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .map(function (res) { return res.json(); })
            .catch(function (err) { return Observable_1.Observable.throw(err); });
    };
    BasketService = __decorate([
        core_1.Injectable()
    ], BasketService);
    return BasketService;
}());
exports.BasketService = BasketService;
