package com.delacruz.shoems.repository;
import com.delacruz.shoems.entity.CategoryData;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoryDataRepository extends CrudRepository<CategoryData, Integer> {
    List<CategoryData> findByIsActiveTrue();
    List<CategoryData> findByExperienceType(String experienceType);
    CategoryData findByName(String name);
}
