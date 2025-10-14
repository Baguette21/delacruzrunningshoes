package com.delacruz.shoems.serviceimpl;
import com.delacruz.shoems.entity.RunningShoeData;
import com.delacruz.shoems.model.RunningShoe;
import com.delacruz.shoems.repository.RunningShoeDataRepository;
import com.delacruz.shoems.service.RunningShoeService;
import com.delacruz.shoems.transform.TransformRunningShoeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RunningShoeServiceImpl implements RunningShoeService {
    
    @Autowired
    private RunningShoeDataRepository runningShoeDataRepository;
    
    @Autowired
    private TransformRunningShoeService transformRunningShoeService;

    @Override
    public RunningShoe[] getAll() {
        List<RunningShoeData> dataList = (List<RunningShoeData>) runningShoeDataRepository.findAll();
        return transformRunningShoeService.transformToRunningShoe(dataList);
    }

    @Override
    public RunningShoe get(int id) {
        Optional<RunningShoeData> data = runningShoeDataRepository.findById(id);
        if (data.isPresent()) {
            return transformRunningShoeService.transformToRunningShoe(data.get());
        }
        return null;
    }

    @Override
    public RunningShoe create(RunningShoe shoe) {
        RunningShoeData data = transformRunningShoeService.transformToRunningShoeData(shoe);
        RunningShoeData savedData = runningShoeDataRepository.save(data);
        return transformRunningShoeService.transformToRunningShoe(savedData);
    }

    @Override
    public RunningShoe update(RunningShoe shoe) {
        RunningShoeData data = transformRunningShoeService.transformToRunningShoeData(shoe);
        RunningShoeData updatedData = runningShoeDataRepository.save(data);
        return transformRunningShoeService.transformToRunningShoe(updatedData);
    }

    @Override
    public void delete(int id) {
        runningShoeDataRepository.deleteById(id);
    }

    @Override
    public RunningShoe[] getByGender(String gender) {
        List<RunningShoeData> dataList = runningShoeDataRepository.findByGender(gender);
        return transformRunningShoeService.transformToRunningShoe(dataList);
    }

    @Override
    public RunningShoe[] getByExperience(String experienceType) {
        List<RunningShoeData> dataList = runningShoeDataRepository.findByExperienceType(experienceType);
        return transformRunningShoeService.transformToRunningShoe(dataList);
    }

    @Override
    public RunningShoe[] getByTerrain(String terrainType) {
        List<RunningShoeData> dataList = runningShoeDataRepository.findByTerrainType(terrainType);
        return transformRunningShoeService.transformToRunningShoe(dataList);
    }

    @Override
    public RunningShoe[] getByBrand(String brand) {
        List<RunningShoeData> dataList = runningShoeDataRepository.findByBrand(brand);
        return transformRunningShoeService.transformToRunningShoe(dataList);
    }

    @Override
    public RunningShoe[] searchByName(String searchTerm) {
        List<RunningShoeData> dataList = runningShoeDataRepository.findByNameContainingIgnoreCase(searchTerm);
        return transformRunningShoeService.transformToRunningShoe(dataList);
    }
}
