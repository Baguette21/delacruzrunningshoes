package com.delacruz.shoems.service;
import com.delacruz.shoems.model.Category;

public interface CategoryService {
    Category[] getAll();
    Category get(int id);
    Category create(Category category);
    Category update(Category category);
    void delete(int id);
    Category[] getByExperience(String experienceType);
}
