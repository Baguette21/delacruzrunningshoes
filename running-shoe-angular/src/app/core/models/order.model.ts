export interface Order {
  id?: number;
  customerName: string;
  contactNumber: string;
  shippingAddress: string;
  email?: string;
  orderDate?: Date;
  totalAmount: number;
  status?: OrderStatus;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id?: number;
  shoeId: number;
  shoeBrand: string;
  shoeName: string;
  size: string;
  gender: 'MEN' | 'WOMEN';
  quantity: number;
  price: number;
  imageUrl?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

