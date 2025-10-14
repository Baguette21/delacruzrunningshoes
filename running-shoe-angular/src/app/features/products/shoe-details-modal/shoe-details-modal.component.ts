import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunningShoe } from '../../../core/models';

@Component({
  selector: 'app-shoe-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shoe-details-modal.component.html',
  styleUrls: ['./shoe-details-modal.component.scss']
})
export class ShoeDetailsModalComponent {
  @Input() shoe!: RunningShoe;
  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<RunningShoe>();

  onClose(): void {
    this.close.emit();
  }

  onAddToCart(): void {
    this.addToCart.emit(this.shoe);
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
}

