import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoeManagementComponent } from '../shoe-management/shoe-management.component';
import { ViewOrdersComponent } from '../view-orders/view-orders.component';
import { ShoeService, OrderService } from '../../../core/services';
import { RunningShoe } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ShoeManagementComponent,
    ViewOrdersComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'shoes' | 'orders' = 'shoes';
  
  totalShoes: number = 0;
  totalOrders: number = 0;
  totalBrands: number = 0;

  constructor(
    private shoeService: ShoeService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Load shoes stats
    this.shoeService.getAllShoes().subscribe({
      next: (shoes: RunningShoe[]) => {
        this.totalShoes = shoes.length;
        const brands = new Set(shoes.map(s => s.brand));
        this.totalBrands = brands.size;
      },
      error: (error) => {
        console.error('Error loading shoes:', error);
      }
    });

    // Load orders stats
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.totalOrders = orders.length;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  switchTab(tab: 'shoes' | 'orders'): void {
    this.activeTab = tab;
  }

  onDataChanged(): void {
    this.loadStats();
  }
}

