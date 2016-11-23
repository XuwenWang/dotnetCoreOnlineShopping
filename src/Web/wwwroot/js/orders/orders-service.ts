import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import './rxjs-operators';

@Injectable()
export class OrdersService {

    // TODO: replace the following url with the 3rd party api urls
    // should use the actual 3rd parti api url here
    // for test we use the mocked url instead
    private urlGetOrders: string = 'getOrders';

    // constructor, http service injected
    constructor(private http: Http) { }

    // get placed orders
    getOrders(page, pageSize) {
        let params = new URLSearchParams();
        params.set('page', page);
        params.set('pageSize', pageSize);

        return this.http.get(this.urlGetOrders+'?'+params.toString())
            .map(res => res.json())
            .catch(err => Observable.throw(err));
    }
}


