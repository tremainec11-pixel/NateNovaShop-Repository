import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  products = [

    {
      id: 1,
      title: 'MacBook Pro',
      description: 'M4 • 32GB RAM',
      price: 49999,
      image: 'https://picsum.photos/500/350?1'
    },

    {
      id: 2,
      title: 'iPhone Ultra',
      description: 'OLED • 512GB',
      price: 28999,
      image: 'https://picsum.photos/500/350?2'
    }

  ];

  cart: any[] = [];

  newProduct = {
    title: '',
    description: '',
    price: 0,
    image: ''
  };

  addToCart(product: any) {

    this.cart.push(product);

  }

  deleteProduct(id: number) {

    this.products =
      this.products.filter(
        product => product.id !== id
      );

  }

  addProduct() {

    const product = {

      id: Date.now(),

      title: this.newProduct.title,

      description: this.newProduct.description,

      price: this.newProduct.price,

      image: this.newProduct.image

    };

    this.products.push(product);

    this.newProduct = {
      title: '',
      description: '',
      price: 0,
      image: ''
    };

  }

  getTotal() {

    return this.cart.reduce(
      (total, item) =>
        total + item.price,
      0
    );

  }

    async checkout() {

    try {

      const response = await fetch(
        "http://localhost:3000/create-checkout-session",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            items: this.cart.map(item => ({

              name: item.title,
              price: item.price,
              quantity: 1

            }))

          })

        }
      );

      const data = await response.json();

      window.location.href = data.url;

    } catch (error) {

      console.error("Stripe Checkout Error:", error);

    }

  }

}