"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var Subject_1 = require('rxjs/Subject');
var AppComponent = (function () {
    // constructor, order service injected
    function AppComponent(ordersService) {
        var _this = this;
        this.ordersService = ordersService;
        this.orders = [];
        this.page = 1;
        this.pageSize = 10; //default page size
        this.pageStream = new Subject_1.Subject();
        this.pageStream
            .startWith(1)
            .switchMap(function (p) { _this.page = p; return _this.ordersService.getOrders(p, _this.pageSize); })
            .subscribe(function (data) {
            if (data && data.length == _this.pageSize)
                _this.hasMore = true;
            else
                _this.hasMore = false;
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var o = data_1[_i];
                _this.orders.push(o);
            }
        });
    }
    // show more orders (next page)
    AppComponent.prototype.showMore = function () {
        this.pageStream.next(this.page + 1);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-orders',
            templateUrl: 'OrdersTemplate'
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
