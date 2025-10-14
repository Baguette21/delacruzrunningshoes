package com.delacruz.shoems.transform;
import com.delacruz.shoems.entity.RunningShoeData;
import com.delacruz.shoems.model.RunningShoe;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransformRunningShoeServiceImpl implements TransformRunningShoeService {

    @Override
    public RunningShoe transformToRunningShoe(RunningShoeData data) {
        if (data == null) return null;
        
        RunningShoe shoe = new RunningShoe();
        shoe.setId(data.getId());
        shoe.setName(data.getName());
        shoe.setBrand(data.getBrand());
        shoe.setModel(data.getModel());
        shoe.setPrice(data.getPrice());
        shoe.setDescription(data.getDescription());
        shoe.setGender(data.getGender());
        shoe.setExperienceType(data.getExperienceType());
        shoe.setCushioningLevel(data.getCushioningLevel());
        shoe.setDropHeight(data.getDropHeight());
        shoe.setWeight(data.getWeight());
        shoe.setStabilityType(data.getStabilityType());
        shoe.setTerrainType(data.getTerrainType());
        shoe.setArchSupport(data.getArchSupport());
        shoe.setImageUrl(data.getImageUrl());
        shoe.setSku(data.getSku());
        shoe.setInStock(data.isInStock());
        shoe.setStockQuantity(data.getStockQuantity());
        shoe.setActive(data.isActive());
        shoe.setIdealFor(data.getIdealFor());
        shoe.setKeyFeatures(data.getKeyFeatures());
        shoe.setSizingNotes(data.getSizingNotes());
        shoe.setReleaseDate(data.getReleaseDate());
        shoe.setCarbonPlated(data.isCarbonPlated());
        shoe.setMensSizes(data.getMensSizes());
        shoe.setWomensSizes(data.getWomensSizes());
        shoe.setSizeStockJson(data.getSizeStockJson());
        
        return shoe;
    }

    @Override
    public RunningShoeData transformToRunningShoeData(RunningShoe shoe) {
        if (shoe == null) return null;
        
        RunningShoeData data = new RunningShoeData();
        data.setId(shoe.getId());
        data.setName(shoe.getName());
        data.setBrand(shoe.getBrand());
        data.setModel(shoe.getModel());
        data.setPrice(shoe.getPrice());
        data.setDescription(shoe.getDescription());
        data.setGender(shoe.getGender());
        data.setExperienceType(shoe.getExperienceType());
        data.setCushioningLevel(shoe.getCushioningLevel());
        data.setDropHeight(shoe.getDropHeight());
        data.setWeight(shoe.getWeight());
        data.setStabilityType(shoe.getStabilityType());
        data.setTerrainType(shoe.getTerrainType());
        data.setArchSupport(shoe.getArchSupport());
        data.setImageUrl(shoe.getImageUrl());
        data.setSku(shoe.getSku());
        data.setInStock(shoe.isInStock());
        data.setStockQuantity(shoe.getStockQuantity());
        data.setActive(shoe.isActive());
        data.setIdealFor(shoe.getIdealFor());
        data.setKeyFeatures(shoe.getKeyFeatures());
        data.setSizingNotes(shoe.getSizingNotes());
        data.setReleaseDate(shoe.getReleaseDate());
        data.setCarbonPlated(shoe.isCarbonPlated());
        data.setMensSizes(shoe.getMensSizes());
        data.setWomensSizes(shoe.getWomensSizes());
        data.setSizeStockJson(shoe.getSizeStockJson());
        
        return data;
    }

    @Override
    public RunningShoe[] transformToRunningShoe(List<RunningShoeData> dataList) {
        if (dataList == null) return new RunningShoe[0];
        
        return dataList.stream()
                .map(this::transformToRunningShoe)
                .collect(Collectors.toList())
                .toArray(new RunningShoe[0]);
    }

    @Override
    public RunningShoeData[] transformToRunningShoeData(List<RunningShoe> shoeList) {
        if (shoeList == null) return new RunningShoeData[0];
        
        return shoeList.stream()
                .map(this::transformToRunningShoeData)
                .collect(Collectors.toList())
                .toArray(new RunningShoeData[0]);
    }
}
