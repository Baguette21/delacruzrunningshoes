import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RunningShoe, StabilityType, TerrainType, ExperienceType, Gender } from '../../../core/models';
import { SizeStockModalComponent } from '../size-stock-modal/size-stock-modal.component';
import { ModalService } from '../../../core/services';

@Component({
  selector: 'app-shoe-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, SizeStockModalComponent],
  templateUrl: './shoe-edit-modal.component.html',
  styleUrls: ['./shoe-edit-modal.component.scss']
})
export class ShoeEditModalComponent implements OnInit {
  @Input() shoe?: RunningShoe;
  @Input() mode: 'add' | 'edit' = 'edit';
  @Output() save = new EventEmitter<{shoe: RunningShoe, imageFile?: File}>();
  @Output() close = new EventEmitter<void>();

  editedShoe!: RunningShoe;
  imageFile?: File;
  imagePreview?: string;
  isDragging = false;
  showStockModal = false;

  // Enums for dropdowns
  stabilityTypes = Object.values(StabilityType);
  terrainTypes = Object.values(TerrainType);
  experienceTypes = Object.values(ExperienceType);
  genders = Object.values(Gender);
  dropHeights = ['4MM', '5MM', '6MM', '7MM', '8MM', '10MM', '12MM'];

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    if (this.mode === 'add') {
      // Create empty shoe for adding
      this.editedShoe = {
        brand: '',
        name: '',
        description: '',
        price: 0,
        dropHeight: '8MM',
        weight: '',
        stabilityType: StabilityType.NEUTRAL,
        terrainType: TerrainType.ROAD,
        experienceType: ExperienceType.SPRINGY,
        gender: Gender.UNISEX,
        stockQuantity: 10,
        inStock: true,
        carbonPlated: false,
        mensSizes: '7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13',
        womensSizes: '5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11',
        sizeStockJson: this.generateDefaultSizeStockJson()
      };
      this.editedShoe.stockQuantity = this.calculateTotalStock(this.editedShoe.sizeStockJson);
    } else {
      // Create a copy of the shoe to edit
      this.editedShoe = { ...this.shoe! };
      
      // Ensure carbonPlated is initialized
      if (this.editedShoe.carbonPlated === undefined) {
        this.editedShoe.carbonPlated = false;
      }
      
      // Ensure sizing fields are initialized
      if (!this.editedShoe.mensSizes) {
        this.editedShoe.mensSizes = '7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13';
      }
      if (!this.editedShoe.womensSizes) {
        this.editedShoe.womensSizes = '5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11';
      }
      
      // Initialize sizeStockJson if not present
      if (!this.editedShoe.sizeStockJson) {
        this.editedShoe.sizeStockJson = this.generateDefaultSizeStockJson();
      }
      
      // Calculate total stock from sizeStockJson
      this.editedShoe.stockQuantity = this.calculateTotalStock(this.editedShoe.sizeStockJson);
      
      // Set current image as preview
      if (this.shoe?.imageUrl || this.shoe?.name) {
        this.imagePreview = this.getShoeImagePath(this.shoe.name);
      }
    }
  }

  generateDefaultSizeStockJson(): string {
    const mensSizes = '7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13'.split(',');
    const womensSizes = '5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11'.split(',');
    
    const sizeStockMap: { [key: string]: number } = {};
    for (const size of mensSizes) {
      sizeStockMap[`MEN_${size.trim()}`] = 10;
    }
    for (const size of womensSizes) {
      sizeStockMap[`WOMEN_${size.trim()}`] = 10;
    }
    
    return JSON.stringify(sizeStockMap);
  }

  calculateTotalStock(sizeStockJson?: string): number {
    if (!sizeStockJson) return 0;
    try {
      const stockMap = JSON.parse(sizeStockJson);
      return Object.values(stockMap).reduce((sum: number, val) => sum + (val as number), 0);
    } catch {
      return 0;
    }
  }

  openStockModal(): void {
    this.showStockModal = true;
  }

  closeStockModal(): void {
    this.showStockModal = false;
  }

  handleStockSave(sizeStockJson: string): void {
    this.editedShoe.sizeStockJson = sizeStockJson;
    this.editedShoe.stockQuantity = this.calculateTotalStock(sizeStockJson);
    console.log('✏️ Edit Modal - Received stock save:', {
      sizeStockJson: this.editedShoe.sizeStockJson,
      stockQuantity: this.editedShoe.stockQuantity
    });
    this.closeStockModal();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  private handleFile(file: File): void {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.modalService.warning('Please upload an image file (PNG, JPG, etc.)', 'Invalid File Type');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.modalService.warning('Image size should be less than 5MB', 'File Too Large');
      return;
    }

    this.imageFile = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imageFile = undefined;
    if (this.mode === 'edit' && this.shoe?.name) {
      this.imagePreview = this.getShoeImagePath(this.shoe.name);
    } else {
      this.imagePreview = undefined;
    }
  }

  onSave(): void {
    console.log('💾 Edit Modal - Saving shoe:', {
      id: this.editedShoe.id,
      name: this.editedShoe.name,
      stockQuantity: this.editedShoe.stockQuantity,
      sizeStockJson: this.editedShoe.sizeStockJson,
      mensSizes: this.editedShoe.mensSizes,
      womensSizes: this.editedShoe.womensSizes
    });
    this.save.emit({ shoe: this.editedShoe, imageFile: this.imageFile });
  }

  onClose(): void {
    this.close.emit();
  }

  private getShoeImagePath(name: string): string {
    const fileName = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return `/shoe_images/${fileName}.png`;
  }
}

