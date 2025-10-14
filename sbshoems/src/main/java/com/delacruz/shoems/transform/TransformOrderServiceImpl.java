package com.delacruz.shoems.transform;

import com.delacruz.shoems.entity.OrderData;
import com.delacruz.shoems.entity.OrderItemData;
import com.delacruz.shoems.model.Order;
import com.delacruz.shoems.model.OrderItem;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransformOrderServiceImpl implements TransformOrderService {

    @Override
    public Order transformToOrder(OrderData data) {
        if (data == null) return null;
        
        Order order = new Order();
        order.setId(data.getId());
        order.setCustomerName(data.getCustomerName());
        order.setEmail(data.getEmail());
        order.setContactNumber(data.getContactNumber());
        order.setShippingAddress(data.getShippingAddress());
        order.setTotalAmount(data.getTotalAmount());
        order.setStatus(data.getStatus());
        order.setOrderDate(data.getOrderDate());
        
        // Transform order items
        if (data.getOrderItems() != null) {
            List<OrderItem> items = data.getOrderItems().stream()
                    .map(this::transformToOrderItem)
                    .collect(Collectors.toList());
            order.setOrderItems(items);
        }
        
        return order;
    }

    @Override
    public OrderData transformToOrderData(Order order) {
        if (order == null) return null;
        
        OrderData data = new OrderData();
        data.setId(order.getId());
        data.setCustomerName(order.getCustomerName());
        data.setEmail(order.getEmail());
        data.setContactNumber(order.getContactNumber());
        data.setShippingAddress(order.getShippingAddress());
        data.setTotalAmount(order.getTotalAmount());
        data.setStatus(order.getStatus() != null ? order.getStatus() : "PENDING");
        data.setOrderDate(order.getOrderDate());
        
        // Transform order items
        if (order.getOrderItems() != null) {
            List<OrderItemData> items = order.getOrderItems().stream()
                    .map(item -> {
                        OrderItemData itemData = transformToOrderItemData(item);
                        itemData.setOrder(data);
                        return itemData;
                    })
                    .collect(Collectors.toList());
            data.setOrderItems(items);
        }
        
        return data;
    }

    @Override
    public OrderItem transformToOrderItem(OrderItemData data) {
        if (data == null) return null;
        
        OrderItem item = new OrderItem();
        item.setId(data.getId());
        item.setShoeId(data.getShoeId());
        item.setShoeBrand(data.getShoeBrand());
        item.setShoeName(data.getShoeName());
        item.setSize(data.getSize());
        item.setGender(data.getGender());
        item.setQuantity(data.getQuantity());
        item.setPrice(data.getPrice());
        item.setImageUrl(data.getImageUrl());
        
        return item;
    }

    @Override
    public OrderItemData transformToOrderItemData(OrderItem item) {
        if (item == null) return null;
        
        OrderItemData data = new OrderItemData();
        data.setId(item.getId());
        data.setShoeId(item.getShoeId());
        data.setShoeBrand(item.getShoeBrand());
        data.setShoeName(item.getShoeName());
        data.setSize(item.getSize());
        data.setGender(item.getGender());
        data.setQuantity(item.getQuantity());
        data.setPrice(item.getPrice());
        data.setImageUrl(item.getImageUrl());
        
        return data;
    }

    @Override
    public Order[] transformToOrder(List<OrderData> dataList) {
        if (dataList == null) return new Order[0];
        
        return dataList.stream()
                .map(this::transformToOrder)
                .collect(Collectors.toList())
                .toArray(new Order[0]);
    }
}

