package com.delacruz.shoems.transform;
import com.delacruz.shoems.entity.RunningShoeData;
import com.delacruz.shoems.model.RunningShoe;
import java.util.List;

public interface TransformRunningShoeService {
    RunningShoe transformToRunningShoe(RunningShoeData data);
    RunningShoeData transformToRunningShoeData(RunningShoe shoe);
    RunningShoe[] transformToRunningShoe(List<RunningShoeData> dataList);
    RunningShoeData[] transformToRunningShoeData(List<RunningShoe> shoeList);
}
