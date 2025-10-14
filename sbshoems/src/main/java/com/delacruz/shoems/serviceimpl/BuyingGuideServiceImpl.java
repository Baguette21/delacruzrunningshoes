package com.delacruz.shoems.serviceimpl;
import com.delacruz.shoems.model.BuyingGuideRecommendation;
import com.delacruz.shoems.model.RunningShoe;
import com.delacruz.shoems.service.BuyingGuideService;
import com.delacruz.shoems.service.RunningShoeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class BuyingGuideServiceImpl implements BuyingGuideService {
    
    @Autowired
    private RunningShoeService runningShoeService;

    @Override
    public BuyingGuideRecommendation[] getRecommendations(String gender, String experienceType, String terrainType) {
        RunningShoe[] genderShoes = runningShoeService.getByGender(gender);
        RunningShoe[] experienceShoes = runningShoeService.getByExperience(experienceType);
        RunningShoe[] terrainShoes = runningShoeService.getByTerrain(terrainType);
        
        List<BuyingGuideRecommendation> recommendations = new ArrayList<>();
        for (RunningShoe shoe : genderShoes) {
            if (Arrays.asList(experienceShoes).contains(shoe) && 
                Arrays.asList(terrainShoes).contains(shoe)) {
                
                int matchScore = calculateMatchScore(shoe, gender, experienceType, terrainType);
                String reason = generateRecommendationReason(shoe, experienceType);
                
                recommendations.add(new BuyingGuideRecommendation(shoe, matchScore, reason));
            }
        }
        
        return recommendations.toArray(new BuyingGuideRecommendation[0]);
    }

    @Override
    public RunningShoe[] getShoesByExperience(String experienceType) {
        return runningShoeService.getByExperience(experienceType);
    }

    @Override
    public RunningShoe[] getBouncyShoes() {
        return runningShoeService.getByExperience("BOUNCY");
    }

    @Override
    public RunningShoe[] getSpringyShoes() {
        return runningShoeService.getByExperience("SPRINGY");
    }

    @Override
    public RunningShoe[] getStructuredShoes() {
        return runningShoeService.getByExperience("STRUCTURED");
    }

    @Override
    public String[] getExperienceTypeDescriptions() {
        return new String[]{
            "BOUNCY: Energetic and responsive, great for speed work and tempo runs",
            "SPRINGY: Lively rebound, perfect for daily training and longer runs",
            "STRUCTURED: Firm and stable, ideal for support and motion control"
        };
    }
    
    private int calculateMatchScore(RunningShoe shoe, String gender, String experienceType, String terrainType) {
        int score = 70;
        
        if (shoe.getGender().equals(gender)) score += 10;
        if (shoe.getExperienceType().equals(experienceType)) score += 15;
        if (shoe.getTerrainType().equals(terrainType)) score += 5;
        
        return Math.min(score, 100);
    }
    
    private String generateRecommendationReason(RunningShoe shoe, String experienceType) {
        switch (experienceType) {
            case "BOUNCY":
                return "Perfect for runners who want energy return and responsiveness in their stride.";
            case "SPRINGY":
                return "Ideal for daily training with lively cushioning that propels you forward.";
            case "STRUCTURED":
                return "Excellent choice for runners who need stability and motion control.";
            default:
                return "Great running shoe for your needs.";
        }
    }
}
