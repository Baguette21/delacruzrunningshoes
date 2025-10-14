package com.delacruz.shoems.controller;

import com.delacruz.shoems.config.DataLoaderConfig;
import com.delacruz.shoems.model.Category;
import com.delacruz.shoems.repository.RunningShoeDataRepository;
import com.delacruz.shoems.service.CategoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    
    @Autowired
    private RunningShoeDataRepository repository;
    
    @Autowired(required = false)
    private CategoryService categoryService;
    
    @Autowired
    private DataLoaderConfig dataLoaderConfig;
    
    @Autowired
    private javax.persistence.EntityManager entityManager;
    
    @PostMapping("/migrate/add-carbon-column")
    public ResponseEntity<?> addCarbonColumn() {
        try {
            logger.info("Adding carbonPlated column to database...");
            String sql = "ALTER TABLE running_shoe_data ADD COLUMN IF NOT EXISTS carbonPlated BIT DEFAULT 0";
            entityManager.createNativeQuery(sql).executeUpdate();
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Carbon column added successfully");
            logger.info("Carbon column migration completed");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error adding carbon column: ", e);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Migration failed (column may already exist)");
            response.put("error", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
    
    @PostMapping("/migrate/populate-size-stock")
    public ResponseEntity<?> populateSizeStock() {
        try {
            logger.info("Populating sizeStockJson for all shoes...");
            
            // Get all shoes
            Iterable<com.delacruz.shoems.entity.RunningShoeData> shoesIterable = repository.findAll();
            java.util.List<com.delacruz.shoems.entity.RunningShoeData> shoes = new java.util.ArrayList<>();
            shoesIterable.forEach(shoes::add);
            int updatedCount = 0;
            
            for (com.delacruz.shoems.entity.RunningShoeData shoe : shoes) {
                // Check if sizeStockJson is already populated
                if (shoe.getSizeStockJson() == null || shoe.getSizeStockJson().isEmpty()) {
                    // Set default sizes if not present
                    if (shoe.getMensSizes() == null || shoe.getMensSizes().isEmpty()) {
                        shoe.setMensSizes("7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13");
                    }
                    if (shoe.getWomensSizes() == null || shoe.getWomensSizes().isEmpty()) {
                        shoe.setWomensSizes("5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11");
                    }
                    
                    // Generate sizeStockJson
                    StringBuilder sizeStock = new StringBuilder("{");
                    String[] mensSizes = shoe.getMensSizes().split(",");
                    String[] womensSizes = shoe.getWomensSizes().split(",");
                    
                    boolean first = true;
                    for (String size : mensSizes) {
                        if (!first) sizeStock.append(",");
                        sizeStock.append("\"MEN_").append(size.trim()).append("\":10");
                        first = false;
                    }
                    for (String size : womensSizes) {
                        sizeStock.append(",\"WOMEN_").append(size.trim()).append("\":10");
                    }
                    sizeStock.append("}");
                    
                    shoe.setSizeStockJson(sizeStock.toString());
                    
                    // Calculate total stock
                    int totalStock = (mensSizes.length + womensSizes.length) * 10;
                    shoe.setStockQuantity(totalStock);
                    
                    repository.save(shoe);
                    updatedCount++;
                    
                    logger.info("Updated shoe ID {}: {} - {}", shoe.getId(), shoe.getBrand(), shoe.getName());
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Size stock population completed");
            response.put("updatedCount", updatedCount);
            response.put("totalShoes", shoes.size());
            
            logger.info("Size stock migration completed. Updated {} out of {} shoes", updatedCount, shoes.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error populating size stock: ", e);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Migration failed");
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @DeleteMapping("/shoes/clear")
    public ResponseEntity<?> clearAllShoes() {
        try {
            long count = repository.count();
            logger.info("Deleting {} shoes from database...", count);
            
            repository.deleteAll();
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully deleted all running shoe data");
            response.put("deletedCount", count);
            
            logger.info("Successfully deleted {} shoes", count);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error clearing database: ", e);
            return ResponseEntity.internalServerError()
                    .body("Error clearing database: " + e.getMessage());
        }
    }
    
    @PostMapping("/shoes/reload")
    public ResponseEntity<?> reloadFromCSV() {
        try {
            logger.info("Reloading data from CSV...");
            
            // First clear existing data
            long oldCount = repository.count();
            repository.deleteAll();
            logger.info("Deleted {} existing records", oldCount);
            
            // Reload from CSV
            dataLoaderConfig.run();
            
            long newCount = repository.count();
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully reloaded data from CSV");
            response.put("deletedCount", oldCount);
            response.put("loadedCount", newCount);
            
            logger.info("Successfully reloaded {} shoes from CSV", newCount);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error reloading from CSV: ", e);
            return ResponseEntity.internalServerError()
                    .body("Error reloading from CSV: " + e.getMessage());
        }
    }
    
    @GetMapping("/shoes/stats")
    public ResponseEntity<?> getStats() {
        try {
            long totalCount = repository.count();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalShoes", totalCount);
            stats.put("status", "Database is " + (totalCount > 0 ? "populated" : "empty"));
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            logger.error("Error getting stats: ", e);
            return ResponseEntity.internalServerError()
                    .body("Error getting stats: " + e.getMessage());
        }
    }
    
    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        try {
            if (categoryService == null) {
                return ResponseEntity.ok(new Category[0]);
            }
            Category[] categories = categoryService.getAll();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            logger.error("Error getting categories: ", e);
            return ResponseEntity.internalServerError()
                    .body("Error getting categories: " + e.getMessage());
        }
    }
    
    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        try {
            if (categoryService == null) {
                return ResponseEntity.internalServerError()
                        .body("Category service is not available");
            }
            logger.info("Creating new category: {}", category.getName());
            Category created = categoryService.create(category);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            logger.error("Error creating category: ", e);
            return ResponseEntity.internalServerError()
                    .body("Error creating category: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable int id) {
        try {
            if (categoryService == null) {
                return ResponseEntity.internalServerError()
                        .body("Category service is not available");
            }
            logger.info("Deleting category with id: {}", id);
            categoryService.delete(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Category deleted successfully");
            response.put("id", id);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error deleting category: ", e);
            return ResponseEntity.internalServerError()
                    .body("Error deleting category: " + e.getMessage());
        }
    }
}

