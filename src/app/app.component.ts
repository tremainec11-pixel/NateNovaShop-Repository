import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

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

  editingProductId: number | null = null;

  newProduct = {
    title: '',
    description: '',
    price: 0,
    image: ''
  };

  ngOnInit(): void {

    const savedProducts = localStorage.getItem('products');

    if (savedProducts) {
      this.products = JSON.parse(savedProducts);
    } else {
      localStorage.setItem(
        'products',
        JSON.stringify(this.products)
      );
    }
  }

  addToCart(product: any): void {
    this.cart.push(product);
  }

  deleteProduct(id: number): void {

    this.products = this.products.filter(
      product => product.id !== id
    );

    localStorage.setItem(
      'products',
      JSON.stringify(this.products)
    );

    if (this.editingProductId === id) {

      this.editingProductId = null;

      this.newProduct = {
        title: '',
        description: '',
        price: 0,
        image: ''
      };
    }
  }

  editProduct(product: any): void {

    this.newProduct = {
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image
    };

    this.editingProductId = product.id;
  }

  addProduct(): void {

  if (!this.newProduct.title.trim()) {

    alert('Ingresa el nombre del producto.');
    return;

  }

  if (this.editingProductId !== null) {

    const index = this.products.findIndex(
      p => p.id === this.editingProductId
    );

    if (index !== -1) {

      this.products[index] = {
        id: this.editingProductId,
        title: this.newProduct.title,
        description: this.newProduct.description || '',
        price: this.newProduct.price,
        image: this.newProduct.image
      };

    }

    this.editingProductId = null;

  } else {

    const product = {

      id: Date.now(),

      title: this.newProduct.title,

      description:
        this.newProduct.description || '',

      price: this.newProduct.price,

      image:
        this.newProduct.image ||
        'https://picsum.photos/500/350'

    };

    this.products.push(product);

  }

  localStorage.setItem(
    'products',
    JSON.stringify(this.products)
  );

  this.newProduct = {
    title: '',
    description: '',
    price: 0,
    image: ''
  };

  }

  getTotal(): number {

    return this.cart.reduce(
      (total, item) => total + item.price,
      0
    );
  }

  clearCart(): void {
    this.cart = [];
  }

  async checkout(): Promise<void> {

    try {

      const response = await fetch(
        'http://localhost:3000/api/pagos/checkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
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

      console.log('Stripe response:', data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No se recibió URL de Stripe');
      }

    } catch (error) {

      console.error(
        'Error al iniciar checkout:',
        error
      );
    }
  }
}