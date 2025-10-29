import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoeService } from '../../../core/services';
import { RunningShoe } from '../../../core/models';
import { Router } from '@angular/router';

interface Question {
  id: number;
  question: string;
  options: QuizOption[];
}

interface QuizOption {
  label: string;
  value: string;
  icon: string;
}

interface QuizAnswers {
  priceRange?: string;
  runnerType?: string;
  shoeFeeling?: string;
  support?: string;
}

@Component({
  selector: 'app-shoe-matcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shoe-matcher.component.html',
  styleUrls: ['./shoe-matcher.component.scss']
})
export class ShoeMatcherComponent implements OnInit {
  currentStep = 0;
  answers: QuizAnswers = {};
  matchedShoes: RunningShoe[] = [];
  showResults = false;
  allShoes: RunningShoe[] = [];

  questions: Question[] = [
    {
      id: 1,
      question: "What's your price range?",
      options: [
        { label: 'Less than ₱8,000', value: 'under8000', icon: 'bi-cash-stack' },
        { label: '₱8,000 - ₱10,000', value: '8000to10000', icon: 'bi-wallet2' },
        { label: "Price doesn't matter", value: 'any', icon: 'bi-infinity' }
      ]
    },
    {
      id: 2,
      question: 'What type of runner are you?',
      options: [
        { label: 'Casual runner (trains for fun)', value: 'casual', icon: 'bi-emoji-smile' },
        { label: 'Competitive runner (trains for races)', value: 'competitive', icon: 'bi-trophy' }
      ]
    },
    {
      id: 3,
      question: 'How do you like your shoes to feel?',
      options: [
        { label: 'Soft and cushioned', value: 'soft', icon: 'bi-cloud' },
        { label: 'Firm and snappy', value: 'firm', icon: 'bi-lightning' }
      ]
    },
    {
      id: 4,
      question: 'Do you need extra support?',
      options: [
        { label: 'Yes, I need support', value: 'yes', icon: 'bi-shield-check' },
        { label: 'No, I don\'t need support', value: 'no', icon: 'bi-x-circle' }
      ]
    }
  ];

  constructor(
    private shoeService: ShoeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadShoes();
  }

  loadShoes(): void {
    this.shoeService.getAllShoes().subscribe({
      next: (shoes) => {
        this.allShoes = shoes;
      },
      error: (error) => {
        console.error('Error loading shoes:', error);
      }
    });
  }

  selectOption(questionId: number, value: string): void {
    switch (questionId) {
      case 1:
        this.answers.priceRange = value;
        break;
      case 2:
        this.answers.runnerType = value;
        break;
      case 3:
        this.answers.shoeFeeling = value;
        break;
      case 4:
        this.answers.support = value;
        break;
    }

    // Move to next step or show results
    if (this.currentStep < this.questions.length - 1) {
      setTimeout(() => {
        this.currentStep++;
      }, 300);
    } else {
      setTimeout(() => {
        this.findMatchingShoes();
        this.showResults = true;
      }, 300);
    }
  }

  findMatchingShoes(): void {
    let filtered = [...this.allShoes];

    // Filter by price
    if (this.answers.priceRange === 'under8000') {
      filtered = filtered.filter(shoe => shoe.price < 8000);
    } else if (this.answers.priceRange === '8000to10000') {
      filtered = filtered.filter(shoe => shoe.price >= 8000 && shoe.price <= 10000);
    }

    // Filter by runner type
    if (this.answers.runnerType === 'casual') {
      // Casual runners prefer bouncy or structured shoes
      filtered = filtered.filter(shoe => 
        shoe.experienceType === 'BOUNCY' || shoe.experienceType === 'STRUCTURED'
      );
    } else if (this.answers.runnerType === 'competitive') {
      // Competitive runners prefer springy shoes
      filtered = filtered.filter(shoe => shoe.experienceType === 'SPRINGY');
    }

    // Filter by shoe feeling
    if (this.answers.shoeFeeling === 'soft') {
      filtered = filtered.filter(shoe => shoe.experienceType === 'BOUNCY');
    } else if (this.answers.shoeFeeling === 'firm') {
      filtered = filtered.filter(shoe => 
        shoe.experienceType === 'SPRINGY' || shoe.experienceType === 'STRUCTURED'
      );
    }

    // Filter by support
    if (this.answers.support === 'yes') {
      filtered = filtered.filter(shoe => 
        shoe.stabilityType === 'STABILITY' || shoe.stabilityType === 'MOTION_CONTROL'
      );
    } else if (this.answers.support === 'no') {
      filtered = filtered.filter(shoe => shoe.stabilityType === 'NEUTRAL');
    }

    // Sort by price and take top matches
    this.matchedShoes = filtered
      .sort((a, b) => a.price - b.price)
      .slice(0, 6);

    // If no matches, show some popular shoes
    if (this.matchedShoes.length === 0) {
      this.matchedShoes = this.allShoes.slice(0, 6);
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  restart(): void {
    this.currentStep = 0;
    this.answers = {};
    this.matchedShoes = [];
    this.showResults = false;
  }

  viewAllShoes(): void {
    this.router.navigate(['/shoes']);
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

  getProgressPercentage(): number {
    return ((this.currentStep + 1) / this.questions.length) * 100;
  }
}

