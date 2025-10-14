import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ShoeService } from '../../../core/services';
import { RunningShoe, StabilityType, TerrainType, ExperienceType, Gender } from '../../../core/models';
import { ShoeEditModalComponent } from '../shoe-edit-modal/shoe-edit-modal.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-shoe-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ShoeEditModalComponent],
  templateUrl: './shoe-management.component.html',
  styleUrls: ['./shoe-management.component.scss']
})
export class ShoeManagementComponent implements OnInit {
  @Output() dataChanged = new EventEmitter<void>();

  shoes: RunningShoe[] = [];
  loading = false;
  alertMessage = '';
  alertType: 'success' | 'danger' | 'info' = 'info';
  showModal = false;
  modalMode: 'add' | 'edit' = 'edit';
  selectedShoe?: RunningShoe;

  // No longer needed - removed unused variables

  constructor(
    private shoeService: ShoeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadShoes();
  }

  loadShoes(): void {
    this.loading = true;
    this.shoeService.getAllShoes().subscribe({
      next: (shoes) => {
        this.shoes = shoes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading shoes:', error);
        this.showAlert('Error loading shoes: ' + error.message, 'danger');
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.modalMode = 'add';
    this.selectedShoe = undefined;
    this.showModal = true;
  }

  editShoe(shoe: RunningShoe): void {
    this.modalMode = 'edit';
    this.selectedShoe = shoe;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedShoe = undefined;
  }

  async saveShoe(data: {shoe: RunningShoe, imageFile?: File}): Promise<void> {
    try {
      console.log('🔄 Management - Saving shoe to backend:', {
        mode: this.modalMode,
        id: data.shoe.id,
        name: data.shoe.name,
        stockQuantity: data.shoe.stockQuantity,
        sizeStockJson: data.shoe.sizeStockJson,
        mensSizes: data.shoe.mensSizes,
        womensSizes: data.shoe.womensSizes
      });
      
      if (this.modalMode === 'add') {
        // Add new shoe
        const addedShoe = await this.shoeService.createShoe(data.shoe).toPromise();
        console.log('✅ Backend response (add):', addedShoe);
        
        // If there's an image file, upload it
        if (data.imageFile && addedShoe) {
          await this.uploadImage(data.imageFile, data.shoe.name);
        }

        this.showAlert(`✅ Added "${data.shoe.brand} ${data.shoe.name}" successfully!`, 'success');
      } else {
        // Update existing shoe
        const updatedShoe = await this.shoeService.updateShoe(data.shoe).toPromise();
        console.log('✅ Backend response (update):', updatedShoe);
        
        // If there's an image file, upload it
        if (data.imageFile && updatedShoe) {
          await this.uploadImage(data.imageFile, data.shoe.name);
        }

        this.showAlert(`✅ Updated "${data.shoe.brand} ${data.shoe.name}" successfully!`, 'success');
      }
      
      this.closeModal();
      this.loadShoes();
      this.dataChanged.emit();
    } catch (error: any) {
      console.error('❌ Error saving shoe:', error);
      this.showAlert('Error saving shoe: ' + error.message, 'danger');
    }
  }

  private uploadImage(file: File, shoeName: string): Promise<any> {
    // Generate filename from shoe name
    const fileName = shoeName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '.png';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);

    return this.http.post(`${environment.apiUrl}/shoes/upload-image`, formData).toPromise();
  }

  deleteShoe(shoe: RunningShoe): void {
    if (!confirm(`Are you sure you want to delete "${shoe.brand} ${shoe.name}"?`)) {
      return;
    }

    if (shoe.id) {
      this.shoeService.deleteShoe(shoe.id).subscribe({
        next: () => {
          this.showAlert(`✅ Deleted "${shoe.brand} ${shoe.name}" successfully!`, 'success');
          this.loadShoes();
          this.dataChanged.emit();
        },
        error: (error) => {
          console.error('Error deleting shoe:', error);
          this.showAlert('Error deleting shoe: ' + error.message, 'danger');
        }
      });
    }
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

