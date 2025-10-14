package com.delacruz.shoems.repository;
import com.delacruz.shoems.entity.BrandData;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BrandDataRepository extends CrudRepository<BrandData, Integer> {
    List<BrandData> findByIsActiveTrue();
    BrandData findByName(String name);
}
