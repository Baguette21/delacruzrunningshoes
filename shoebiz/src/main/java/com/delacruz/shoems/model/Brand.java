package com.delacruz.shoems.model;
import lombok.Data;

@Data
public class Brand {
    int id;
    String name;
    String description;
    String website;
    String logoUrl;
    boolean isActive;
    
    public String toString() {
        return name;
    }
}
