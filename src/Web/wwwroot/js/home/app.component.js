"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var Subject_1 = require('rxjs/Subject');
var basket_1 = require('./basket');
var AppComponent = (function () {
    // constructor, native element and product service injected in
    function AppComponent(elm, productService) {
        var _this = this;
        this.productService = productService;
        this.basket = new basket_1.Basket();
        this.products = [];
        this.filterStream = new Subject_1.Subject();
        this.pageStream = new Subject_1.Subject();
        this.pageSize = 9;
        this.loggedIn = elm.nativeElement.getAttribute('logged-in') == '1';
        this.productService.getBasketInfo(this.basket.id)
            .subscribe(function (data) {
            _this.basket.count = data.count;
            _this.basket.total = data.total;
        });
        this.page = 1;
        this.filterSource =
            this.filterStream
                .debounceTime(300)
                .distinctUntilChanged()
                .map(function (f) {
                _this.filter = f;
                _this.products = null;
                _this.page = 1;
                return { filter: f, page: 1 };
            });
        this.pageSource =
            this.pageStream.map(function (p) { _this.page = p; return { filter: _this.filter, page: p }; });
        // merge page number and search filter stream 
        this.source = this.filterSource.merge(this.pageSource)
            .startWith({ filter: '', page: 1 })
            .switchMap(function (params) {
            _this.loading = true;
            return _this.productService.getProducts(params.filter, params.page, _this.pageSize);
        })
            .subscribe(function (data) {
            if (_this.products == null)
                _this.products = [];
            if (data && data.length > 0) {
                _this.hasMore = true;
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var c = data_1[_i];
                    _this.products.push(c);
                }
            }
            if (!data || data.length < _this.pageSize)
                _this.hasMore = false;
        }, function (err) { alert(err); });
    }
    // search proudct by name
    AppComponent.prototype.search = function (filter) {
        this.filterStream.next(filter);
    };
    // load more products (next page)
    AppComponent.prototype.showMore = function () {
        this.page += 1;
        this.pageStream.next(this.page);
    };
    // show basket dropdown menu
    AppComponent.prototype.showBasket = function () {
        if (this.basket.count > 0) {
            clearTimeout(this.handle);
            this.onBasket = true;
        }
    };
    // hide basket dropdown menu
    AppComponent.prototype.hideBasket = function () {
        var _this = this;
        this.handle = setTimeout(function () { _this.onBasket = false; }, 300);
    };
    // add product to basket
    AppComponent.prototype.addToBasket = function (product) {
        var _this = this;
        //if not logged in, show the dialog
        // todo: consider to user ng2-bootstrap
        if (!this.loggedIn) {
            return $('#login-dialog').modal();
        }
        this.productService.addToBasket(product.id, 1)
            .subscribe(function (data) {
            _this.basket.count = data.count;
            _this.basket.total = data.total;
        }, function (err) { alert(err); });
    };
    // place an order against all products in basket
    AppComponent.prototype.placeAllOrder = function () {
        var _this = this;
        this.productService.placeAllOrder()
            .subscribe(function (data) {
            _this.basket.count = 0;
            _this.basket.total = 0;
        });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'home',
            templateUrl: 'home/hometemplate'
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
