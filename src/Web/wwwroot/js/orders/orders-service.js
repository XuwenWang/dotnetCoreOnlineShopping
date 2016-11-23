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
var OrdersService = (function () {
    // constructor, http service injected
    function OrdersService(http) {
        this.http = http;
        // TODO: replace the following url with the 3rd party api urls
        // should use the actual 3rd parti api url here
        // for test we use the mocked url instead
        this.urlGetOrders = 'getOrders';
    }
    // get placed orders
    OrdersService.prototype.getOrders = function (page, pageSize) {
        var params = new http_1.URLSearchParams();
        params.set('page', page);
        params.set('pageSize', pageSize);
        return this.http.get(this.urlGetOrders + '?' + params.toString())
            .map(function (res) { return res.json(); })
            .catch(function (err) { return Observable_1.Observable.throw(err); });
    };
    OrdersService = __decorate([
        core_1.Injectable()
    ], OrdersService);
    return OrdersService;
}());
exports.OrdersService = OrdersService;
