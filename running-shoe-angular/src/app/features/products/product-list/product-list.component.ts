import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoeService, CartService, ModalService } from '../../../core/services';
import { RunningShoe } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ShoeDetailsModalComponent } from '../shoe-details-modal/shoe-details-modal.component';
import { SizeSelectionModalComponent } from '../../../shared/components/size-selection-modal/size-selection-modal.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, ShoeDetailsModalComponent, SizeSelectionModalComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  allShoes: RunningShoe[] = [];
  filteredShoes: RunningShoe[] = [];
  loading = true;
  
  searchTerm = '';
  selectedBrand = '';
  sortBy = 'name';

  brands: string[] = [];
  
  showDetailsModal = false;
  showSizeModal = false;
  selectedShoe?: RunningShoe;
  shoeForCart?: RunningShoe;

  constructor(
    private shoeService: ShoeService,
    private cartService: CartService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadAllShoes();
  }

  loadAllShoes(): void {
    this.loading = true;
    this.shoeService.getAllShoes().subscribe({
      next: (shoes) => {
        this.allShoes = shoes;
        this.filteredShoes = shoes;
        this.extractBrands();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading shoes:', error);
        this.loading = false;
      }
    });
  }

  extractBrands(): void {
    const brandSet = new Set(this.allShoes.map(shoe => shoe.brand));
    this.brands = Array.from(brandSet).sort();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onBrandChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let shoes = [...this.allShoes];

    // Search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      shoes = shoes.filter(shoe =>
        shoe.name.toLowerCase().includes(search) ||
        shoe.brand.toLowerCase().includes(search) ||
        (shoe.description && shoe.description.toLowerCase().includes(search))
      );
    }

    // Brand filter
    if (this.selectedBrand) {
      shoes = shoes.filter(shoe => shoe.brand === this.selectedBrand);
    }

    // Sort
    shoes = this.sortShoes(shoes);

    this.filteredShoes = shoes;
  }

  sortShoes(shoes: RunningShoe[]): RunningShoe[] {
    const sorted = [...shoes];
    switch (this.sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'brand':
        return sorted.sort((a, b) => a.brand.localeCompare(b.brand));
      default:
        return sorted;
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

  openDetails(shoe: RunningShoe): void {
    this.selectedShoe = shoe;
    this.showDetailsModal = true;
  }

  closeDetails(): void {
    this.showDetailsModal = false;
    this.selectedShoe = undefined;
  }

  handleAddToCart(shoe: RunningShoe): void {
    // Open size selection modal
    this.shoeForCart = shoe;
    this.showSizeModal = true;
    this.closeDetails();
  }

  closeSizeModal(): void {
    this.showSizeModal = false;
    this.shoeForCart = undefined;
  }

  handleSizeSelected(data: {shoe: RunningShoe, size: string, gender: 'MEN' | 'WOMEN'}): void {
    // Check if size has stock
    const availableStock = this.cartService.getAvailableStock(data.shoe, data.size, data.gender);
    
    if (availableStock <= 0) {
      this.modalService.warning(`Sorry, size ${data.gender === 'MEN' ? "Men's" : "Women's"} US ${data.size} is out of stock!`, 'Out of Stock');
      return;
    }

    // Add to cart
    this.cartService.addToCart(data.shoe, data.size, data.gender);
    console.log('Added to cart:', data);
    this.modalService.success(`Added ${data.shoe.brand} ${data.shoe.name} (Size: ${data.gender === 'MEN' ? "Men's" : "Women's"} US ${data.size}) to cart!`, 'Added to Cart');
    this.closeSizeModal();
  }
}

