import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, OrderService, ModalService } from '../../../core/services';
import { Order, OrderItem } from '../../../core/models';

export interface CartItem {
  shoe: any;
  size: string;
  gender: 'MEN' | 'WOMEN';
  quantity: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount = 0;
  
  // Customer details
  customerName = '';
  email = '';
  contactNumber = '';
  shippingAddress = '';
  
  isProcessing = false;
  orderPlaced = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private modalService: ModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
    this.totalAmount = this.cartService.getCartTotal();
    
    // Redirect to shoes if cart is empty
    if (this.cartItems.length === 0) {
      this.modalService.warning('Your cart is empty! Please add some shoes first.', 'Empty Cart');
      this.router.navigate(['/shoes']);
    }
  }

  getShoeImagePath(name: string): string {
    const fileName = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return `/shoe_images/${fileName}.png`;
  }

  async removeItem(index: number): Promise<void> {
    const confirmed = await this.modalService.confirm('Are you sure you want to remove this item from cart?', 'Remove Item');
    if (confirmed) {
      this.cartService.removeFromCart(index);
      this.loadCart();
    }
  }

  updateQuantity(index: number, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(index);
    } else {
      this.cartService.updateQuantity(index, quantity);
      this.loadCart();
    }
  }

  placeOrder(): void {
    // Validate form
    if (!this.customerName || !this.contactNumber || !this.shippingAddress) {
      this.modalService.warning('Please fill in all required fields', 'Missing Information');
      return;
    }

    this.isProcessing = true;

    // Create order items
    const orderItems: OrderItem[] = this.cartItems.map(item => ({
      shoeId: item.shoe.id!,
      shoeBrand: item.shoe.brand,
      shoeName: item.shoe.name,
      size: item.size,
      gender: item.gender,
      quantity: item.quantity,
      price: item.shoe.price,
      imageUrl: this.getShoeImagePath(item.shoe.name)
    }));

    // Create order
    const order: Order = {
      customerName: this.customerName,
      email: this.email,
      contactNumber: this.contactNumber,
      shippingAddress: this.shippingAddress,
      totalAmount: this.totalAmount,
      orderItems: orderItems
    };

    // Submit order and update stock
    this.cartService.checkout().subscribe({
      next: (stockUpdateResults) => {
        console.log('✅ Stock updated:', stockUpdateResults);
        
        // Now save the order
        this.orderService.createOrder(order).subscribe({
          next: (createdOrder) => {
            console.log('✅ Order created:', createdOrder);
            this.orderPlaced = true;
            this.cartService.clearCart();
            this.isProcessing = false;
            
            // Show success message for 3 seconds then redirect
            setTimeout(() => {
              this.router.navigate(['/shoes']);
            }, 3000);
          },
          error: (error) => {
            console.error('❌ Failed to save order:', error);
            this.modalService.error('Order placed but failed to save order details. Please contact support.', 'Order Error');
            this.isProcessing = false;
          }
        });
      },
      error: (error) => {
        console.error('❌ Checkout failed:', error);
        this.modalService.error('Checkout failed. Please check stock availability and try again.', 'Checkout Failed');
        this.isProcessing = false;
      }
    });
  }

  continueShopping(): void {
    this.router.navigate(['/shoes']);
  }
}

