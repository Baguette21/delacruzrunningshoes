package com.delacruz.shoems.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "order_items")
public class OrderItemData {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private OrderData order;
    
    private Integer shoeId;
    private String shoeBrand;
    private String shoeName;
    private String size;
    private String gender; // MEN or WOMEN
    private Integer quantity;
    private BigDecimal price;
    
    @Column(length = 500)
    private String imageUrl;
}

