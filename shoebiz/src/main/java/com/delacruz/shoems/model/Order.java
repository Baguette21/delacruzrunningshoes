package com.delacruz.shoems.model;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class Order {
    private Integer id;
    private String customerName;
    private String email;
    private String contactNumber;
    private String shippingAddress;
    private BigDecimal totalAmount;
    private String status;
    private Date orderDate;
    private List<OrderItem> orderItems;
}

