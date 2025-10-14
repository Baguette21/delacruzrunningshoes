package com.delacruz.shoems.controller;
import com.delacruz.shoems.model.BuyingGuideRecommendation;
import com.delacruz.shoems.model.RunningShoe;
import com.delacruz.shoems.service.BuyingGuideService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class BuyingGuideController {
    Logger logger = LoggerFactory.getLogger(BuyingGuideController.class);
    
    @Autowired
    private BuyingGuideService buyingGuideService;

    @GetMapping("/api/buying-guide/experience-types")
    public ResponseEntity<?> getExperienceTypes() {
        try {
            String[] descriptions = buyingGuideService.getExperienceTypeDescriptions();
            return ResponseEntity.ok(descriptions);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @GetMapping("/api/buying-guide/bouncy")
    public ResponseEntity<?> getBouncyShoes() {
        logger.info("Getting bouncy running shoes");
        try {
            RunningShoe[] shoes = buyingGuideService.getBouncyShoes();
            return ResponseEntity.ok(shoes);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @GetMapping("/api/buying-guide/springy")
    public ResponseEntity<?> getSpringyShoes() {
        logger.info("Getting springy running shoes");
        try {
            RunningShoe[] shoes = buyingGuideService.getSpringyShoes();
            return ResponseEntity.ok(shoes);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @GetMapping("/api/buying-guide/structured")
    public ResponseEntity<?> getStructuredShoes() {
        logger.info("Getting structured running shoes");
        try {
            RunningShoe[] shoes = buyingGuideService.getStructuredShoes();
            return ResponseEntity.ok(shoes);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @GetMapping("/api/buying-guide/recommendations")
    public ResponseEntity<?> getRecommendations(
            @RequestParam String gender,
            @RequestParam String experience,
            @RequestParam String terrain) {
        logger.info("Getting recommendations for: " + gender + ", " + experience + ", " + terrain);
        try {
            BuyingGuideRecommendation[] recommendations = buyingGuideService.getRecommendations(
                gender.toUpperCase(), experience.toUpperCase(), terrain.toUpperCase());
            return ResponseEntity.ok(recommendations);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }
}
