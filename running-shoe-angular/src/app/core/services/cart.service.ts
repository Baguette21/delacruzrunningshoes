import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RunningShoe } from '../models';

export interface CartItem {
  shoe: RunningShoe;
  size: string;
  gender: 'MEN' | 'WOMEN';
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();
  private apiUrl = `${environment.apiUrl}/shoes`;

  constructor(private http: HttpClient) {
    // Load cart from localStorage on init
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('shopping_cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        this.cartItems.next(items);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem('shopping_cart', JSON.stringify(this.cartItems.value));
  }

  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  addToCart(shoe: RunningShoe, size: string, gender: 'MEN' | 'WOMEN'): void {
    const currentItems = this.cartItems.value;
    
    // Check if item with same shoe, size, and gender already exists
    const existingItemIndex = currentItems.findIndex(
      item => item.shoe.id === shoe.id && item.size === size && item.gender === gender
    );

    if (existingItemIndex >= 0) {
      // Increment quantity
      currentItems[existingItemIndex].quantity++;
    } else {
      // Add new item
      currentItems.push({
        shoe,
        size,
        gender,
        quantity: 1
      });
    }

    this.cartItems.next(currentItems);
    this.saveCartToStorage();
  }

  removeFromCart(index: number): void {
    const currentItems = this.cartItems.value;
    currentItems.splice(index, 1);
    this.cartItems.next(currentItems);
    this.saveCartToStorage();
  }

  updateQuantity(index: number, quantity: number): void {
    const currentItems = this.cartItems.value;
    if (quantity <= 0) {
      this.removeFromCart(index);
    } else {
      currentItems[index].quantity = quantity;
      this.cartItems.next(currentItems);
      this.saveCartToStorage();
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveCartToStorage();
  }

  getCartCount(): number {
    return this.cartItems.value.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + (item.shoe.price * item.quantity),
      0
    );
  }

  getAvailableStock(shoe: RunningShoe, size: string, gender: 'MEN' | 'WOMEN'): number {
    if (!shoe.sizeStockJson) {
      return shoe.stockQuantity || 0;
    }
    try {
      const stockMap = JSON.parse(shoe.sizeStockJson);
      const key = `${gender}_${size}`;
      return stockMap[key] || 0;
    } catch {
      return shoe.stockQuantity || 0;
    }
  }

  checkout(): Observable<any[]> {
    const items = this.getCartItems();
    
    // Create an array of update requests
    const updateRequests = items.map(item =>
      this.http.post(`${this.apiUrl}/${item.shoe.id}/update-size-stock`, {
        size: item.size,
        gender: item.gender,
        quantity: item.quantity
      })
    );

    // Execute all requests in parallel
    return forkJoin(updateRequests);
  }
}

