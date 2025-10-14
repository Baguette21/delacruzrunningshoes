package com.delacruz.shoems.model;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItem {
    private Integer id;
    private Integer shoeId;
    private String shoeBrand;
    private String shoeName;
    private String size;
    private String gender;
    private Integer quantity;
    private BigDecimal price;
    private String imageUrl;
}

