package com.delacruz.shoems.service;
import com.delacruz.shoems.model.Brand;

public interface BrandService {
    Brand[] getAll();
    Brand get(int id);
    Brand create(Brand brand);
    Brand update(Brand brand);
    void delete(int id);
}
