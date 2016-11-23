import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import './rxjs-operators';

@Injectable()
export class BasketService {

    // TODO: replace the following urls with the 3rd party api urls
    // should use the actual 3rd parti api url here
    // for test we use the mocked url instead
    private urlGetProducts: string = 'getBasketProducts';
    private urlUpdateQuantity: string = 'updateQuantity';
    private urlRemoveProduct: string = 'removeProduct';
    private urlPlaceOrder: string = 'placeOrder';
    private urlPlaceAllOrder: string = 'placeAllOrder';

    // constructor, http injected
    constructor(private http: Http) { }

    // get proudct list of the basket
    getProducts() {
        return this.http.get(this.urlGetProducts)
            .map(res => res.json())
            .catch(err => Observable.throw(err));
    }

    // change quantity of product
    updateQuantity( product: number, quantity: number) {
        return this.http.post(this.urlUpdateQuantity, $.param({ productId: product, quantity: quantity }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .map(res => res.json())
            .catch(err => Observable.throw(err));
    }

    // remove product from basket
    removeProduct( product: number) {
        return this.http.post(this.urlRemoveProduct, $.param({productId:product}), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .map(res => res.json())
            .catch(err => Observable.throw(err));
    }

    // place an order against a product
    placeOrder(product: number) {
        return this.http.post(this.urlPlaceOrder, $.param({ productId: product }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .map(res => res.json())
            .catch(err => Observable.throw(err));
    }

    // place an order against all products in basket
    placeAllOrder() {
        return this.http.post(this.urlPlaceAllOrder, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .map(res => res.json())
            .catch(err => Observable.throw(err));
    }


}


