package com.delacruz.shoems.service;
import com.delacruz.shoems.model.BuyingGuideRecommendation;
import com.delacruz.shoems.model.RunningShoe;

public interface BuyingGuideService {
    BuyingGuideRecommendation[] getRecommendations(String gender, String experienceType, String terrainType);
    RunningShoe[] getShoesByExperience(String experienceType);
    RunningShoe[] getBouncyShoes();
    RunningShoe[] getSpringyShoes();
    RunningShoe[] getStructuredShoes();
    String[] getExperienceTypeDescriptions();
}
