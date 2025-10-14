package com.delacruz.shoems.model;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class RunningShoe {
    int id;
    String name;
    String brand;
    String model;
    BigDecimal price;
    String description;
    String gender; // MEN, WOMEN
    String experienceType; // BOUNCY, SPRINGY, STRUCTURED
    String cushioningLevel; // MINIMAL, MODERATE, MAXIMUM
    String dropHeight; // 0MM, 4MM, 6MM, 8MM, 10MM, 12MM
    String weight;
    String stabilityType; // NEUTRAL, STABILITY, MOTION_CONTROL
    String terrainType; // ROAD, TRAIL, MIXED
    String archSupport; // LOW, NORMAL, HIGH
    String imageUrl;
    String sku;
    boolean inStock;
    int stockQuantity;
    boolean isActive;
    String idealFor;
    String keyFeatures;
    String sizingNotes;
    Date releaseDate;
    boolean carbonPlated;
    String mensSizes; // Comma-separated US sizes (e.g., "7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12")
    String womensSizes; // Comma-separated US sizes (e.g., "5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10")
    String sizeStockJson; // JSON format: {"MEN_7": 10, "MEN_7.5": 10, "WOMEN_5": 10, ...}
    
    public String toString() {
        return brand + " " + name + " (" + experienceType + ")";
    }
}
