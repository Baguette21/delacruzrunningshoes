import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CartService, ModalService } from '../../../core/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartCount = 0;
  isAdminPage = false;
  private cartSubscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(
    private cartService: CartService,
    private modalService: ModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
    });

    // Check current route on init
    this.isAdminPage = this.router.url.startsWith('/admin');

    // Subscribe to route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isAdminPage = event.url.startsWith('/admin');
      });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onCartClick(event: Event): void {
    event.preventDefault();
    const items = this.cartService.getCartItems();
    
    if (items.length === 0) {
      this.modalService.warning('Your cart is empty! Add some shoes first.', 'Empty Cart');
      return;
    }

    // Navigate to checkout page
    this.router.navigate(['/shoes/checkout']);
  }
}

