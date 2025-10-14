package com.delacruz.shoems.entity;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import javax.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "running_shoe_data")
public class RunningShoeData {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
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
    
    @Column(length = 500)
    String mensSizes; // Comma-separated US sizes
    
    @Column(length = 500)
    String womensSizes; // Comma-separated US sizes
    
    @Column(length = 2000)
    String sizeStockJson; // JSON format: {"MEN_7": 10, "MEN_7.5": 10, "WOMEN_5": 10, ...}

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+08:00")
    private Date lastUpdated;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+08:00")
    private Date created;
}
