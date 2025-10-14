package com.delacruz.shoems.serviceimpl;

import com.delacruz.shoems.entity.OrderData;
import com.delacruz.shoems.model.Order;
import com.delacruz.shoems.repository.OrderDataRepository;
import com.delacruz.shoems.service.OrderService;
import com.delacruz.shoems.transform.TransformOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderDataRepository orderRepository;

    @Autowired
    private TransformOrderService transformOrderService;

    @Override
    public Order createOrder(Order order) {
        OrderData data = transformOrderService.transformToOrderData(order);
        OrderData savedData = orderRepository.save(data);
        return transformOrderService.transformToOrder(savedData);
    }

    @Override
    public Order[] getAllOrders() {
        Iterable<OrderData> dataIterable = orderRepository.findAll();
        List<OrderData> dataList = new ArrayList<>();
        dataIterable.forEach(dataList::add);
        return transformOrderService.transformToOrder(dataList);
    }

    @Override
    public Order getOrderById(Integer id) {
        Optional<OrderData> data = orderRepository.findById(id);
        return data.map(transformOrderService::transformToOrder).orElse(null);
    }

    @Override
    public Order updateOrderStatus(Integer id, String status) {
        Optional<OrderData> optionalData = orderRepository.findById(id);
        if (optionalData.isPresent()) {
            OrderData data = optionalData.get();
            data.setStatus(status);
            OrderData savedData = orderRepository.save(data);
            return transformOrderService.transformToOrder(savedData);
        }
        return null;
    }
}

