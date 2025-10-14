package com.delacruz.shoems.service;

import com.delacruz.shoems.model.Order;

public interface OrderService {
    Order createOrder(Order order);
    Order[] getAllOrders();
    Order getOrderById(Integer id);
    Order updateOrderStatus(Integer id, String status);
}

