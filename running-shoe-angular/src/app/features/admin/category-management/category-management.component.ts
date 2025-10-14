import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services';
import { Category, ExperienceType } from '../../../core/models';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
  @Output() dataChanged = new EventEmitter<void>();

  categories: Category[] = [];
  loading = false;
  alertMessage = '';
  alertType: 'success' | 'danger' | 'info' = 'info';

  // New category form
  newCategory: Category = this.getEmptyCategory();

  // Enums for dropdowns
  experienceTypes = Object.values(ExperienceType);

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.showAlert('Error loading categories: ' + error.message, 'danger');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.newCategory.name || !this.newCategory.experienceType) {
      this.showAlert('Please fill in all required fields', 'danger');
      return;
    }

    this.categoryService.createCategory(this.newCategory).subscribe({
      next: () => {
        this.showAlert('✅ Category added successfully!', 'success');
        this.newCategory = this.getEmptyCategory();
        this.loadCategories();
        this.dataChanged.emit();
      },
      error: (error) => {
        console.error('Error adding category:', error);
        this.showAlert('Error adding category: ' + error.message, 'danger');
      }
    });
  }

  deleteCategory(category: Category): void {
    if (!confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      return;
    }

    if (category.id) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.showAlert(`✅ Deleted category "${category.name}" successfully!`, 'success');
          this.loadCategories();
          this.dataChanged.emit();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.showAlert('Error deleting category: ' + error.message, 'danger');
        }
      });
    }
  }

  private getEmptyCategory(): Category {
    return {
      name: '',
      description: '',
      experienceType: ExperienceType.SPRINGY,
      active: true
    };
  }

  private showAlert(message: string, type: 'success' | 'danger' | 'info'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      if (type !== 'info') {
        this.alertMessage = '';
      }
    }, 5000);
  }
}

