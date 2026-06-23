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
      category: 'Electronics',
      price: 49999,
      image: 'https://picsum.photos/500/350?1'
    },
    {
      id: 2,
      title: 'iPhone Ultra',
      description: 'OLED • 512GB',
      category: 'Electronics',
      price: 28999,
      image: 'https://picsum.photos/500/350?2'
    }
  ];

  cart: any[] = [];
  favorites: any[] = [];
  

editingProductId: number | null = null;

selectedCategory = 'All';

searchTerm = '';

showAccountPanel = false;

newProduct = {
  title: '',
  description: '',
  category: '',
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

  getFilteredProducts() {

  let filtered = this.products;

  if (this.selectedCategory !== 'All') {

    filtered = filtered.filter(
      product =>
        (product.category || '') === this.selectedCategory
    );
  }

  if (this.searchTerm.trim()) {

    filtered = filtered.filter(product =>
      product.title
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }

  return filtered;
}

   
addToCart(product: any): void {
  this.cart.push(product);
}

toggleFavorite(product: any): void {

  const index = this.favorites.findIndex(
    p => p.id === product.id
  );

  if (index === -1) {
    this.favorites.push(product);
  } else {
    this.favorites.splice(index, 1);
  }
}

isFavorite(product: any): boolean {

  return this.favorites.some(
    p => p.id === product.id
  );
}

deleteProduct(id: number): void {
    if (confirm('¿Eliminar producto?')) {

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
          category: '',
          price: 0,
          image: ''
        };
      }
    }
  }

  editProduct(product: any): void {

    this.newProduct = {
      title: product.title,
      description: product.description,
      category: product.category || '',
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

    if (!this.newProduct.category) {
      alert('Selecciona una categoría.');
      return;
    }

    if (this.newProduct.price <= 0) {
      alert('Ingresa un precio válido.');
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
          category: this.newProduct.category,
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

        category:
          this.newProduct.category,

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
      category: '',
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

      if (data.url) {
        window.location.href = data.url;
      }

    } catch (error) {

      console.error(
        'Error al iniciar checkout:',
        error
      );
    }
  }

  showFavorites(): void {
    alert('Favoritos próximamente ❤️');
  }

  showAccount(): void {

  alert(
`👤 Mi Cuenta

Nombre: Mi Cuenta
Correo: usuario@natenova.com

📦 Mis pedidos
- Pedido #1001
- Pedido #1002

🔒 Cerrar sesión`
  );

}

  scrollToProducts(): void {

    const section =
      document.querySelector('.products-section');

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

}