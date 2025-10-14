import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShoeService } from '../../core/services';
import { RunningShoe } from '../../core/models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ShoeMatcherComponent } from './shoe-matcher/shoe-matcher.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, ShoeMatcherComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredShoes: RunningShoe[] = [];
  loading = true;

  constructor(private shoeService: ShoeService) {}

  ngOnInit(): void {
    this.loadFeaturedShoes();
  }

  loadFeaturedShoes(): void {
    this.shoeService.getAllShoes().subscribe({
      next: (shoes) => {
        this.featuredShoes = this.getRandomShoes(shoes, 6);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading shoes:', error);
        this.loading = false;
      }
    });
  }

  filterByExperience(experience: string): void {
    this.loading = true;
    this.shoeService.getShoesByExperience(experience).subscribe({
      next: (shoes) => {
        this.featuredShoes = shoes.slice(0, 6);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering shoes:', error);
        this.loading = false;
      }
    });
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

  private getRandomShoes(shoes: RunningShoe[], count: number): RunningShoe[] {
    const shuffled = [...shoes].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}

