import { Component, OnInit, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Basket } from './basket';
import { Product } from './product';
import { ProductService } from './product-service';

@Component({
    selector: 'home',
    templateUrl: 'home/hometemplate'
})
export class AppComponent implements OnInit {

    onBasket: boolean; // mouse over basket icon
    onDropdown: boolean; // mouse over basket dropdown menu
    loggedIn: boolean; // user logged in

    basket: Basket = new Basket();
    products: Array<Product> = [];

    private filterStream: Subject<string> = new Subject<string>();
    private pageStream: Subject<number> = new Subject<number>();
    private filterSource;
    private pageSource;
    private source;

    filter: string;
    page: number;
    pageSize: number = 9;
    loading: boolean;
    hasMore: boolean;

    // constructor, native element and product service injected in
    constructor(elm: ElementRef, private productService: ProductService) {
        this.loggedIn = elm.nativeElement.getAttribute('logged-in') == '1';
        this.productService.getBasketInfo(this.basket.id)
            .subscribe(data => {
                this.basket.count = data.count;
                this.basket.total = data.total;
            });

        this.page = 1;
        this.filterSource =
            this.filterStream
                .debounceTime(300)
                .distinctUntilChanged()
                .map(f => {
                    this.filter = f;
                    this.products = null;
                    this.page = 1;
                    return { filter: f, page: 1 };
                });
        this.pageSource =
            this.pageStream.map(p => { this.page = p; return { filter: this.filter, page: p } });

        // merge page number and search filter stream 
        this.source = this.filterSource.merge(this.pageSource)
            .startWith({ filter: '', page:1})
            .switchMap((params: { filter: string, page: number }) => {
                this.loading = true;
                return this.productService.getProducts(params.filter, params.page, this.pageSize)
            })
            .subscribe(
            data => {
                if (this.products == null) this.products = [];
                if (data && data.length > 0) {
                    this.hasMore = true;
                    for (let c of data)
                        this.products.push(c);
                }
                if (!data || data.length < this.pageSize)
                    this.hasMore = false;
            },
            err => { alert(err); }
            );

    }

    // search proudct by name
    search(filter: string) {
        this.filterStream.next(filter);
    }

    // load more products (next page)
    showMore() {
        this.page += 1;
        this.pageStream.next(this.page);
    }

    // show basket dropdown menu
    showBasket() {
        if (this.basket.count > 0) {
            clearTimeout(this.handle);
            this.onBasket = true;
        }
    }

    handle: any; // timeout handle

    // hide basket dropdown menu
    hideBasket() {
        this.handle = setTimeout(() => { this.onBasket = false; }, 300);
    }

    // add product to basket
    addToBasket(product: Product) {

        //if not logged in, show the dialog
        // todo: consider to user ng2-bootstrap
        if (!this.loggedIn) {
            return $('#login-dialog').modal();
        }

        this.productService.addToBasket(product.id, 1)
            .subscribe(
            data => {
                this.basket.count = data.count;
                this.basket.total = data.total;
            },
            err => { alert(err); }
        );
        
    }

    // place an order against all products in basket
    placeAllOrder() {
        this.productService.placeAllOrder()
            .subscribe(data => {
                this.basket.count = 0;
                this.basket.total = 0;
            });
    }
}
