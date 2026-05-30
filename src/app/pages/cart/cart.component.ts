import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  cartItems = [
    {
      name: 'Producto Test',
      price: 100,
      quantity: 1
    }
  ];

  constructor(private http: HttpClient) {}

  checkout() {

    console.log("CLICK FUNCIONA");

    this.http.post<any>(
      'http://localhost:3000/api/pagos/checkout',
      {
        items: this.cartItems
      }
    ).subscribe({

      next: (res) => {

        console.log(res);

        window.location.href = res.url;

      },

      error: (err) => {
        console.error(err);
      }

    });

  }

}
