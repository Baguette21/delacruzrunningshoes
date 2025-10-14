import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services';

@Component({
  selector: 'app-database-tools',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './database-tools.component.html',
  styleUrls: ['./database-tools.component.scss']
})
export class DatabaseToolsComponent {
  @Output() dataChanged = new EventEmitter<void>();

  alertMessage = '';
  alertType: 'success' | 'danger' | 'info' = 'info';

  constructor(private adminService: AdminService) {}

  clearDatabase(): void {
    if (!confirm('⚠️ Are you sure you want to DELETE ALL running shoe data?\n\nThis action cannot be undone!')) {
      return;
    }

    this.adminService.clearAllShoes().subscribe({
      next: (response) => {
        this.showAlert(`✅ ${response.message} (${response.deletedCount} records)`, 'success');
        this.dataChanged.emit();
      },
      error: (error) => {
        console.error('Error clearing database:', error);
        this.showAlert('Error clearing database: ' + error.message, 'danger');
      }
    });
  }

  reloadFromCSV(): void {
    if (!confirm('🔄 This will DELETE all current data and RELOAD from CSV.\n\nAre you sure?')) {
      return;
    }

    this.showAlert('⏳ Reloading data from CSV...', 'info');

    this.adminService.reloadFromCSV().subscribe({
      next: (response) => {
        this.showAlert(
          `✅ ${response.message}<br>Deleted: ${response.deletedCount} | Loaded: ${response.loadedCount}`,
          'success'
        );
        this.dataChanged.emit();
      },
      error: (error) => {
        console.error('Error reloading from CSV:', error);
        this.showAlert('Error reloading from CSV: ' + error.message, 'danger');
      }
    });
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

