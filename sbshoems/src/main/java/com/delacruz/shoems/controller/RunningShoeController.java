package com.delacruz.shoems.controller;
import com.delacruz.shoems.model.RunningShoe;
import com.delacruz.shoems.service.RunningShoeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class RunningShoeController {
    Logger logger = LoggerFactory.getLogger(RunningShoeController.class);
    
    @Autowired
    private RunningShoeService runningShoeService;
    
    private static final String IMAGE_DIRECTORY = "src/main/resources/static/shoe_images/";

    @GetMapping("/api/shoes")
    public ResponseEntity<?> listShoes() {
        HttpHeaders headers = new HttpHeaders();
        ResponseEntity<?> response;
        try {
            RunningShoe[] shoes = runningShoeService.getAll();
            response = ResponseEntity.ok().headers(headers).body(shoes);
        } catch (Exception ex) {
            response = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
        return response;
    }

    @GetMapping("/api/shoes/gender/{gender}")
    public ResponseEntity<?> getShoesByGender(@PathVariable String gender) {
        logger.info("Getting shoes for gender: " + gender);
        try {
            RunningShoe[] shoes = runningShoeService.getByGender(gender.toUpperCase());
            return ResponseEntity.ok(shoes);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @GetMapping("/api/shoes/experience/{experience}")
    public ResponseEntity<?> getShoesByExperience(@PathVariable String experience) {
        logger.info("Getting shoes for experience: " + experience);
        try {
            RunningShoe[] shoes = runningShoeService.getByExperience(experience.toUpperCase());
            return ResponseEntity.ok(shoes);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @GetMapping("/api/shoes/terrain/{terrain}")
    public ResponseEntity<?> getShoesByTerrain(@PathVariable String terrain) {
        logger.info("Getting shoes for terrain: " + terrain);
        try {
            RunningShoe[] shoes = runningShoeService.getByTerrain(terrain.toUpperCase());
            return ResponseEntity.ok(shoes);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @GetMapping("/api/shoes/brand/{brand}")
    public ResponseEntity<?> getShoesByBrand(@PathVariable String brand) {
        logger.info("Getting shoes for brand: " + brand);
        try {
            RunningShoe[] shoes = runningShoeService.getByBrand(brand);
            return ResponseEntity.ok(shoes);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @GetMapping("api/shoes/{id}")
    public ResponseEntity<?> get(@PathVariable final Integer id) {
        logger.info("Getting shoe with id: " + id);
        try {
            RunningShoe shoe = runningShoeService.get(id);
            return ResponseEntity.ok(shoe);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PutMapping("api/shoes")
    public ResponseEntity<?> add(@RequestBody RunningShoe shoe) {
        logger.info("Adding new shoe: " + shoe.toString());
        try {
            RunningShoe newShoe = runningShoeService.create(shoe);
            return ResponseEntity.ok(newShoe);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PostMapping("api/shoes")
    public ResponseEntity<?> update(@RequestBody RunningShoe shoe) {
        logger.info("Updating shoe: " + shoe.toString());
        logger.info("Stock Quantity: " + shoe.getStockQuantity());
        logger.info("Size Stock JSON: " + shoe.getSizeStockJson());
        logger.info("Men's Sizes: " + shoe.getMensSizes());
        logger.info("Women's Sizes: " + shoe.getWomensSizes());
        try {
            RunningShoe updatedShoe = runningShoeService.update(shoe);
            logger.info("Updated shoe returned - Stock Quantity: " + updatedShoe.getStockQuantity());
            logger.info("Updated shoe returned - Size Stock JSON: " + updatedShoe.getSizeStockJson());
            return ResponseEntity.ok(updatedShoe);
        } catch (Exception ex) {
            logger.error("Error updating shoe: " + ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @DeleteMapping("api/shoes/{id}")
    public ResponseEntity<?> delete(@PathVariable final Integer id) {
        logger.info("Deleting shoe with id: " + id);
        try {
            runningShoeService.delete(id);
            return ResponseEntity.ok(null);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }
    
    @PostMapping("/api/shoes/upload-image")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("fileName") String fileName) {
        
        logger.info("Uploading image: " + fileName);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate file
            if (file.isEmpty()) {
                response.put("message", "Please select a file to upload");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("message", "Only image files are allowed");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Create directory if it doesn't exist
            File directory = new File(IMAGE_DIRECTORY);
            if (!directory.exists()) {
                directory.mkdirs();
                logger.info("Created image directory: " + IMAGE_DIRECTORY);
            }
            
            // Save file
            Path filePath = Paths.get(IMAGE_DIRECTORY + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            logger.info("Image uploaded successfully: " + fileName);
            
            response.put("message", "Image uploaded successfully");
            response.put("fileName", fileName);
            response.put("fileSize", file.getSize());
            response.put("url", "/shoe_images/" + fileName);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException ex) {
            logger.error("Error uploading image: " + ex.getMessage(), ex);
            response.put("message", "Failed to upload image: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private Map<String, Integer> parseStockJson(String json) {
        Map<String, Integer> result = new HashMap<>();
        if (json == null || json.isEmpty()) {
            return result;
        }
        
        // Remove curly braces
        json = json.replaceAll("[{}]", "");
        
        // Split by comma
        String[] pairs = json.split(",");
        for (String pair : pairs) {
            // Split by colon
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0].trim().replaceAll("\"", "");
                String value = keyValue[1].trim();
                try {
                    result.put(key, Integer.parseInt(value));
                } catch (NumberFormatException e) {
                    logger.warn("Failed to parse stock value: " + value);
                }
            }
        }
        
        return result;
    }

    @PostMapping("api/shoes/{id}/update-size-stock")
    public ResponseEntity<?> updateSizeStock(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> stockUpdate) {
        
        logger.info("Updating size stock for shoe ID: " + id);
        logger.info("Stock update data: " + stockUpdate);
        
        try {
            // Get the shoe
            RunningShoe shoe = runningShoeService.get(id);
            if (shoe == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Shoe not found");
            }
            
            String size = (String) stockUpdate.get("size");
            String gender = (String) stockUpdate.get("gender");
            Integer quantityToDeduct = (Integer) stockUpdate.get("quantity");
            
            if (size == null || gender == null || quantityToDeduct == null) {
                return ResponseEntity.badRequest().body("Missing required fields: size, gender, or quantity");
            }
            
            // Parse current sizeStockJson
            String sizeStockJson = shoe.getSizeStockJson();
            if (sizeStockJson == null || sizeStockJson.isEmpty()) {
                return ResponseEntity.badRequest().body("Shoe does not have size-specific stock tracking");
            }
            
            // Parse JSON manually (simple JSON parser)
            Map<String, Integer> stockMap = parseStockJson(sizeStockJson);
            String key = gender + "_" + size;
            
            if (!stockMap.containsKey(key)) {
                return ResponseEntity.badRequest().body("Size " + size + " not found for gender " + gender);
            }
            
            int currentStock = stockMap.get(key);
            int newStock = currentStock - quantityToDeduct;
            
            if (newStock < 0) {
                return ResponseEntity.badRequest().body("Insufficient stock. Available: " + currentStock);
            }
            
            // Update the stock
            stockMap.put(key, newStock);
            
            // Convert map back to JSON string
            StringBuilder jsonBuilder = new StringBuilder("{");
            boolean first = true;
            for (Map.Entry<String, Integer> entry : stockMap.entrySet()) {
                if (!first) jsonBuilder.append(",");
                jsonBuilder.append("\"").append(entry.getKey()).append("\":").append(entry.getValue());
                first = false;
            }
            jsonBuilder.append("}");
            shoe.setSizeStockJson(jsonBuilder.toString());
            
            // Update total stock quantity
            int totalStock = 0;
            for (Integer stock : stockMap.values()) {
                totalStock += stock;
            }
            shoe.setStockQuantity(totalStock);
            
            // Save the updated shoe
            RunningShoe updatedShoe = runningShoeService.update(shoe);
            
            logger.info("Successfully updated stock for " + key + ". New stock: " + newStock);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Stock updated successfully");
            response.put("previousStock", currentStock);
            response.put("newStock", newStock);
            response.put("updatedShoe", updatedShoe);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception ex) {
            logger.error("Error updating size stock: " + ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + ex.getMessage());
        }
    }
}
