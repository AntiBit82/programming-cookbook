import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CodeExampleCardComponent } from './components/code-example-card/code-example-card.component';
import { CodeExample, ProgrammingLanguage, Category } from './models/code-example.model';
import { ViewChildren, QueryList, HostListener } from '@angular/core';
import { CodeExampleService } from './services/code-example.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule,
    CodeExampleCardComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChildren(CodeExampleCardComponent) cardComponents!: QueryList<CodeExampleCardComponent>;
  
  searchTerm = '';
  availableLanguages = Object.values(ProgrammingLanguage).sort();
  selectedLanguages: string[] = [...this.availableLanguages];
  categoryInput = '';
  selectedCategory: Category | '' = '';
  allExamples: CodeExample[] = [];
  filteredExamples: CodeExample[] = [];
  showScrollButton = false;
  mobileFiltersVisible = false;
  private lastScrollPosition = 0;
  private filtersOpenedScrollPosition = 0;
  private isTogglingFilters = false;

  constructor(private codeExampleService: CodeExampleService) {
    this.loadExamples();
  }

  private loadExamples(): void {
    this.codeExampleService.getExamples().subscribe(examples => {
      this.allExamples = examples;
      this.filteredExamples = examples;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset;
    this.showScrollButton = currentScroll > 300;
    
    // Don't hide filters during toggle animation
    if (this.isTogglingFilters) {
      return;
    }
    
    // Hide mobile filters when scrolling down more than 50px from when filters were opened
    if (this.mobileFiltersVisible && window.innerWidth <= 768) {
      if (currentScroll > this.filtersOpenedScrollPosition + 50) {
        this.mobileFiltersVisible = false;
      }
    }
    
    this.lastScrollPosition = currentScroll;
  }

  toggleMobileFilters(): void {
    this.mobileFiltersVisible = !this.mobileFiltersVisible;
    
    // Scroll to top when opening filters
    if (this.mobileFiltersVisible) {
      this.isTogglingFilters = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Wait for scroll animation and set tracking position
      setTimeout(() => {
        this.filtersOpenedScrollPosition = window.pageYOffset;
        this.isTogglingFilters = false;
      }, 600);
    } else {
      // Reset tracking when closing
      this.lastScrollPosition = window.pageYOffset;
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get availableCategories(): string[] {
    let examples = this.allExamples;
    
    // Filter by selected languages first
    if (this.selectedLanguages.length > 0) {
      examples = examples.filter(example =>
        this.selectedLanguages.includes(example.language)
      );
    }
    
    // Extract unique categories
    const categories = new Set<string>();
    examples.forEach(example => {
      example.categories.forEach(cat => categories.add(cat));
    });
    
    return Array.from(categories).sort();
  }

  get filteredCategories(): string[] {
    const searchTerm = this.categoryInput?.toLowerCase() || '';
    return this.availableCategories.filter(category =>
      category.toLowerCase().includes(searchTerm)
    );
  }

  selectAll(): void {
    this.selectedLanguages = [...this.availableLanguages];
    this.clearCategory();
  }

  selectNone(): void {
    this.selectedLanguages = [];
    this.clearCategory();
  }

  clearCategory(): void {
    this.categoryInput = '';
    this.selectedCategory = '';
    this.onFilterChange();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onFilterChange();
  }

  resetAll(): void {
    this.selectedLanguages = [...this.availableLanguages];
    this.categoryInput = '';
    this.selectedCategory = '';
    this.searchTerm = '';
    this.onFilterChange();
    // Collapse all cards
    setTimeout(() => {
      this.cardComponents?.forEach(card => card.collapse());
    }, 0);
    // Scroll to top
    this.scrollToTop();
  }

  onLanguageChange(): void {
    // Always clear category when languages change
    this.clearCategory();
  }

  onCategorySelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedCategory = event.option.value as Category;
    this.categoryInput = event.option.value;
    this.onFilterChange();
  }

  onFilterChange(): void {
    const term = this.searchTerm.toLowerCase().trim();
    let results = this.allExamples;

    // Filter by selected languages - if none selected, show nothing
    if (this.selectedLanguages.length === 0) {
      this.filteredExamples = [];
      return;
    }
    
    results = results.filter(example =>
      this.selectedLanguages.includes(example.language)
    );

    // Filter by selected category
    if (this.selectedCategory) {
      results = results.filter(example =>
        example.categories.includes(this.selectedCategory as Category)
      );
    }

    // Filter by search term - all words must be present
    if (term) {
      const searchWords = term.split(/\s+/).filter(word => word.length > 0);
      results = results.filter(example => {
        const searchableText = (
          example.header +
          ' ' + example.language +
          ' ' + example.sections.map(s => s.title + ' ' + s.body).join(' ')
        ).toLowerCase();
        
        return searchWords.every(word => searchableText.includes(word));
      });
    }

    this.filteredExamples = results;
  }
}
