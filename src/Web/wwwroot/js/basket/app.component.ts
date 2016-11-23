import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket-service';

@Component({
    selector: 'my-basket',
    templateUrl: 'baskettemplate'
})
export class AppComponent implements OnInit {

    products: Array<{id:number, name:string, imageUrl:string, unitPrice:number, quantity:number, total: number}> = [];
    updating: boolean;

    // basketService injected here
    constructor( private basketService: BasketService) {
        this.basketService.getProducts()
            .subscribe(data => {
                for (let p of data) {
                    this.products.push(p);
                }
            });
    }

    // update a product's quantity by delta (+1 or -1)
    updateQuantity(p, delta: number) {
        // cannot change the quantity to zero
        if (p.quantity + delta < 1 || this.updating) return;
        this.updating = true;
        this.basketService.updateQuantity( p.id, p.quantity + delta)
            .subscribe(data => {
                p.quantity += delta;
                p.total = p.quantity * p.unitPrice;
                this.updating = false;
            });
    }

    // remove the product from basket
    removeProduct(p) {
        this.updating = true;
        this.basketService.removeProduct( p.id)
            .subscribe(data => {
                for (let i = 0; i < this.products.length; i++) {
                    if (this.products[i].id == p.id) {
                        this.products.splice(i, 1);
                        break;
                    }
                }
                this.updating = false;
            });
    }

    // place an order against the given product
    placeOrder(p) {
        if (this.updating) return;
        this.updating = true;
        this.basketService.placeOrder(p.id)
            .subscribe(data => {
                for (let i = 0; i < this.products.length; i++) {
                    if (this.products[i].id == p.id) {
                        this.products.splice(i, 1);
                        break;
                    }
                }
                this.updating = false;
            });
    }

    // palce an order against all products in basket
    placeAllOrder() {
        if (this.updating) return;
        this.updating = true;
        this.basketService.placeAllOrder()
            .subscribe(data => {
                this.products = [];
                this.updating = false;
            });
    }
}
