import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Product[] = [

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
      description: '512GB • OLED',
      price: 28999,
      image: 'https://picsum.photos/500/350?2'
    }

  ];

  getProducts() {
    return this.products;
  }

  addProduct(product: Product) {
    this.products.push(product);
  }

  deleteProduct(id: number) {
    this.products =
      this.products.filter(
        p => p.id !== id
      );
  }

}