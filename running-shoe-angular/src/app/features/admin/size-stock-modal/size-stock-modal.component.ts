import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RunningShoe } from '../../../core/models';

interface Col {
  md: number;
}

interface SizeStock {
  size: string;
  gender: 'MEN' | 'WOMEN';
  stock: number;
}

@Component({
  selector: 'app-size-stock-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './size-stock-modal.component.html',
  styleUrls: ['./size-stock-modal.component.scss']
})
export class SizeStockModalComponent implements OnInit {
  @Input() shoe!: RunningShoe;
  @Output() save = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  sizeStocks: SizeStock[] = [];
  totalStock = 0;

  ngOnInit(): void {
    this.loadSizeStocks();
  }

  loadSizeStocks(): void {
    const sizeStockMap = this.parseSizeStockJson(this.shoe.sizeStockJson);
    
    // Parse men's sizes
    if (this.shoe.mensSizes) {
      const mensSizes = this.shoe.mensSizes.split(',').map(s => s.trim());
      for (const size of mensSizes) {
        const key = `MEN_${size}`;
        this.sizeStocks.push({
          size,
          gender: 'MEN',
          stock: sizeStockMap[key] || 10
        });
      }
    }
    
    // Parse women's sizes
    if (this.shoe.womensSizes) {
      const womensSizes = this.shoe.womensSizes.split(',').map(s => s.trim());
      for (const size of womensSizes) {
        const key = `WOMEN_${size}`;
        this.sizeStocks.push({
          size,
          gender: 'WOMEN',
          stock: sizeStockMap[key] || 10
        });
      }
    }
    
    this.calculateTotalStock();
  }

  parseSizeStockJson(json?: string): { [key: string]: number } {
    if (!json) return {};
    try {
      return JSON.parse(json);
    } catch {
      return {};
    }
  }

  calculateTotalStock(): void {
    this.totalStock = this.sizeStocks.reduce((sum, item) => sum + item.stock, 0);
  }

  onStockChange(): void {
    this.calculateTotalStock();
  }

  onSave(): void {
    // Convert sizeStocks array back to JSON
    const sizeStockMap: { [key: string]: number } = {};
    for (const item of this.sizeStocks) {
      const key = `${item.gender}_${item.size}`;
      sizeStockMap[key] = item.stock;
    }
    const json = JSON.stringify(sizeStockMap);
    console.log('📦 Size Stock Modal - Saving stock data:', {
      sizeStockJson: json,
      totalStock: this.totalStock
    });
    this.save.emit(json);
  }

  onClose(): void {
    this.close.emit();
  }

  setAllStock(stock: number): void {
    for (const item of this.sizeStocks) {
      item.stock = stock;
    }
    this.calculateTotalStock();
  }

  getMensSizes(): SizeStock[] {
    return this.sizeStocks.filter(item => item.gender === 'MEN');
  }

  getWomensSizes(): SizeStock[] {
    return this.sizeStocks.filter(item => item.gender === 'WOMEN');
  }
}

