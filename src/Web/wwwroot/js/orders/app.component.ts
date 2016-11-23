import { Component, OnInit, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { OrdersService } from './orders-service';

@Component({
    selector: 'my-orders',
    templateUrl: 'OrdersTemplate'
})
export class AppComponent implements OnInit {

    orders = [];
    page: number = 1;
    pageSize: number = 10;  //default page size
    hasMore: boolean;
    private pageStream: Subject<number> = new Subject<number>();

    // constructor, order service injected
    constructor(private ordersService: OrdersService) {
        this.pageStream
            .startWith(1)
            .switchMap(p => { this.page = p; return this.ordersService.getOrders(p, this.pageSize); })
            .subscribe(
            data => {
                if (data && data.length == this.pageSize)
                    this.hasMore = true;
                else
                    this.hasMore = false;

                for (let o of data)
                    this.orders.push(o);

            }
            );
    }

    // show more orders (next page)
    showMore() {
        this.pageStream.next(this.page + 1);
    }

}
