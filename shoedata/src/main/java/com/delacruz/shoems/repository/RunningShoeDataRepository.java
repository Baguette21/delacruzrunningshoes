package com.delacruz.shoems.repository;
import com.delacruz.shoems.entity.RunningShoeData;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RunningShoeDataRepository extends CrudRepository<RunningShoeData, Integer> {
    List<RunningShoeData> findByGender(String gender);
    List<RunningShoeData> findByExperienceType(String experienceType);
    List<RunningShoeData> findByTerrainType(String terrainType);
    List<RunningShoeData> findByBrand(String brand);
    List<RunningShoeData> findByIsActiveTrue();
    List<RunningShoeData> findByInStockTrue();
    List<RunningShoeData> findByGenderAndExperienceType(String gender, String experienceType);
    List<RunningShoeData> findByGenderAndTerrainType(String gender, String terrainType);
    List<RunningShoeData> findByNameContainingIgnoreCase(String name);
}
