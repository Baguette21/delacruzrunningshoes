import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, ModalService } from '../../../core/services';
import { Order, OrderStatus } from '../../../core/models';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss', '../admin-shared-styles.scss']
})
export class ViewOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error = '';
  selectedOrder: Order | null = null;
  showOrderDetails = false;

  orderStatuses = Object.values(OrderStatus);

  constructor(
    private orderService: OrderService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';
    
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders.sort((a, b) => {
          const dateA = a.orderDate ? new Date(a.orderDate).getTime() : 0;
          const dateB = b.orderDate ? new Date(b.orderDate).getTime() : 0;
          return dateB - dateA; // Most recent first
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders. Please try again.';
        this.loading = false;
      }
    });
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.showOrderDetails = true;
  }

  closeOrderDetails(): void {
    this.showOrderDetails = false;
    this.selectedOrder = null;
  }

  async updateOrderStatus(orderId: number, newStatus: string): Promise<void> {
    const confirmed = await this.modalService.confirm(`Update order status to ${newStatus}?`, 'Confirm Status Update');
    if (!confirmed) {
      return;
    }

    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        console.log('Order status updated:', updatedOrder);
        // Update the local order in the list
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        // Update selectedOrder if it's the same order
        if (this.selectedOrder?.id === orderId) {
          this.selectedOrder = updatedOrder;
        }
        this.modalService.success('Order status updated successfully!', 'Success');
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        this.modalService.error('Failed to update order status. Please try again.', 'Update Failed');
      }
    });
  }

  getStatusClass(status?: string): string {
    if (!status) return 'status-pending';
    
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'status-pending';
      case 'PROCESSING':
        return 'status-processing';
      case 'SHIPPED':
        return 'status-shipped';
      case 'DELIVERED':
        return 'status-delivered';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  }

  getOrderTotal(order: Order): number {
    return order.totalAmount || 0;
  }

  getOrderItemCount(order: Order): number {
    return order.orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  }

  formatDate(date?: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getItemSubtotal(item: any): number {
    return (item.price || 0) * (item.quantity || 0);
  }
}

