package com.delacruz.shoems.transform;

import com.delacruz.shoems.entity.OrderData;
import com.delacruz.shoems.entity.OrderItemData;
import com.delacruz.shoems.model.Order;
import com.delacruz.shoems.model.OrderItem;
import java.util.List;

public interface TransformOrderService {
    Order transformToOrder(OrderData data);
    OrderData transformToOrderData(Order order);
    OrderItem transformToOrderItem(OrderItemData data);
    OrderItemData transformToOrderItemData(OrderItem item);
    Order[] transformToOrder(List<OrderData> dataList);
}

