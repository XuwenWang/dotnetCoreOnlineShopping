import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import './rxjs-operators';

@Injectable()
export class ProductService {

    // TODO: replace the URLs with the 3rd party api url address

    //should use the actual 3rd parti api url here
    //for test we use the mocked url instead
    private urlGetProducts: string = 'home/productlist';
    private urlAddToBasket: string = 'home/addToBasket';
    private urlGetBasketInfo: string = 'home/getBasketInfo';
    private urlPlaceAllOrder: string = 'home/PlaceAllOrder';


    constructor(private http: Http) { }

    // get product list of the basket
    getProducts(filter: string, page: number, pageSize: number = 9) {
        let params = new URLSearchParams();
        params.set('filter', filter);
        params.set('page', page);
        params.set('pageSize', pageSize);

        return this.http.get(this.urlGetProducts+'?'+params.toString())
            .map(res => res.json())
            .catch(err => Observable.throw(err));
    }

    // add one product into basket
    addToBasket( product: number, quantity: number) {
        return this.http.post(this.urlAddToBasket, $.param({ productId: product, quantity: quantity }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .map(res => res.json())
            .catch(err => Observable.throw(err));
    }

    // get basket summary info: count and total amount of items
    getBasketInfo(id: string) {
        let params = new URLSearchParams();
        params.set('basketId', id);
        return this.http.get(this.urlGetBasketInfo + '?'+params.toString())
            .map(res => res.json())
            .catch(err => Observable.throw(err));
    }

    // place orders agains all items in basket
    placeAllOrder() {
        return this.http.post(this.urlPlaceAllOrder, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .map(res => res.json())
            .catch(err => Observable.throw(err));
    }
}


