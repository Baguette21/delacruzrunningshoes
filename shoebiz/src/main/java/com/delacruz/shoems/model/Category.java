package com.delacruz.shoems.model;
import lombok.Data;

@Data
public class Category {
    int id;
    String name;
    String description;
    String experienceType; // BOUNCY, SPRINGY, STRUCTURED
    boolean isActive;
    
    public String toString() {
        return name + " (" + experienceType + ")";
    }
}
