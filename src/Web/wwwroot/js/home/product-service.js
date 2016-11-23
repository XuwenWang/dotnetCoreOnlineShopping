"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
require('./rxjs-operators');
var ProductService = (function () {
    function ProductService(http) {
        this.http = http;
        // TODO: replace the URLs with the 3rd party api url address
        //should use the actual 3rd parti api url here
        //for test we use the mocked url instead
        this.urlGetProducts = 'home/productlist';
        this.urlAddToBasket = 'home/addToBasket';
        this.urlGetBasketInfo = 'home/getBasketInfo';
        this.urlPlaceAllOrder = 'home/PlaceAllOrder';
    }
    // get product list of the basket
    ProductService.prototype.getProducts = function (filter, page, pageSize) {
        if (pageSize === void 0) { pageSize = 9; }
        var params = new http_1.URLSearchParams();
        params.set('filter', filter);
        params.set('page', page);
        params.set('pageSize', pageSize);
        return this.http.get(this.urlGetProducts + '?' + params.toString())
            .map(function (res) { return res.json(); })
            .catch(function (err) { return Observable_1.Observable.throw(err); });
    };
    // add one product into basket
    ProductService.prototype.addToBasket = function (product, quantity) {
        return this.http.post(this.urlAddToBasket, $.param({ productId: product, quantity: quantity }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .map(function (res) { return res.json(); })
            .catch(function (err) { return Observable_1.Observable.throw(err); });
    };
    // get basket summary info: count and total amount of items
    ProductService.prototype.getBasketInfo = function (id) {
        var params = new http_1.URLSearchParams();
        params.set('basketId', id);
        return this.http.get(this.urlGetBasketInfo + '?' + params.toString())
            .map(function (res) { return res.json(); })
            .catch(function (err) { return Observable_1.Observable.throw(err); });
    };
    // place orders agains all items in basket
    ProductService.prototype.placeAllOrder = function () {
        return this.http.post(this.urlPlaceAllOrder, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .map(function (res) { return res.json(); })
            .catch(function (err) { return Observable_1.Observable.throw(err); });
    };
    ProductService = __decorate([
        core_1.Injectable()
    ], ProductService);
    return ProductService;
}());
exports.ProductService = ProductService;
