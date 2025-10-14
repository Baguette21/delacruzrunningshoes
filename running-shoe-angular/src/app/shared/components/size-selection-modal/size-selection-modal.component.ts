import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RunningShoe } from '../../../core/models';

@Component({
  selector: 'app-size-selection-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './size-selection-modal.component.html',
  styleUrls: ['./size-selection-modal.component.scss']
})
export class SizeSelectionModalComponent implements OnInit {
  @Input() shoe!: RunningShoe;
  @Output() sizeSelected = new EventEmitter<{shoe: RunningShoe, size: string, gender: 'MEN' | 'WOMEN'}>();
  @Output() close = new EventEmitter<void>();

  selectedGender: 'MEN' | 'WOMEN' = 'MEN';
  selectedSize: string = '';
  mensSizesArray: string[] = [];
  womensSizesArray: string[] = [];

  ngOnInit(): void {
    // Parse the comma-separated sizes into arrays
    if (this.shoe.mensSizes) {
      this.mensSizesArray = this.shoe.mensSizes.split(',').map(s => s.trim());
    }
    if (this.shoe.womensSizes) {
      this.womensSizesArray = this.shoe.womensSizes.split(',').map(s => s.trim());
    }
    
    // Set default selection
    if (this.mensSizesArray.length > 0) {
      this.selectedGender = 'MEN';
      this.selectedSize = this.mensSizesArray[Math.floor(this.mensSizesArray.length / 2)];
    } else if (this.womensSizesArray.length > 0) {
      this.selectedGender = 'WOMEN';
      this.selectedSize = this.womensSizesArray[Math.floor(this.womensSizesArray.length / 2)];
    }
  }

  get availableSizes(): string[] {
    return this.selectedGender === 'MEN' ? this.mensSizesArray : this.womensSizesArray;
  }

  onGenderChange(): void {
    // Reset size selection when gender changes
    const sizes = this.availableSizes;
    if (sizes.length > 0) {
      this.selectedSize = sizes[Math.floor(sizes.length / 2)];
    }
  }

  onAddToCart(): void {
    if (this.selectedSize) {
      this.sizeSelected.emit({
        shoe: this.shoe,
        size: this.selectedSize,
        gender: this.selectedGender
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  getShoeImagePath(name: string): string {
    const fileName = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return `/shoe_images/${fileName}.png`;
  }

  getStockForSize(size: string): number {
    if (!this.shoe.sizeStockJson) {
      return this.shoe.stockQuantity || 10; // Fallback to general stock
    }
    try {
      const stockMap = JSON.parse(this.shoe.sizeStockJson);
      const key = `${this.selectedGender}_${size}`;
      return stockMap[key] || 0;
    } catch {
      return this.shoe.stockQuantity || 10;
    }
  }

  get selectedSizeStock(): number {
    return this.getStockForSize(this.selectedSize);
  }
}

