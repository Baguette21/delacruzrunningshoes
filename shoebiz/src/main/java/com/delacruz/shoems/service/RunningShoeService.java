package com.delacruz.shoems.service;
import com.delacruz.shoems.model.RunningShoe;

public interface RunningShoeService {
    RunningShoe[] getAll();
    RunningShoe get(int id);
    RunningShoe create(RunningShoe shoe);
    RunningShoe update(RunningShoe shoe);
    void delete(int id);
    RunningShoe[] getByGender(String gender);
    RunningShoe[] getByExperience(String experienceType);
    RunningShoe[] getByTerrain(String terrainType);
    RunningShoe[] getByBrand(String brand);
    RunningShoe[] searchByName(String searchTerm);
}
