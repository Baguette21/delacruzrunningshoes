package com.delacruz.shoems.model;
import lombok.Data;
import java.util.List;

@Data
public class BuyingGuideRecommendation {
    RunningShoe shoe;
    int matchScore;
    String recommendationReason;
    List<String> whyThisShoe;
    List<String> considerations;
    
    public BuyingGuideRecommendation(RunningShoe shoe, int matchScore, String reason) {
        this.shoe = shoe;
        this.matchScore = matchScore;
        this.recommendationReason = reason;
    }
}
