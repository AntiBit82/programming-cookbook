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
import { CodeExample, ProgrammingLanguage } from './models/code-example.model';
import { CODE_EXAMPLES } from './data/code-examples.data';

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
  title = 'Programming Cookbook';
  searchTerm = '';
  availableLanguages = Object.values(ProgrammingLanguage);
  selectedLanguages: string[] = [...this.availableLanguages];
  categoryInput = '';
  selectedCategory = '';
  allExamples: CodeExample[] = CODE_EXAMPLES;
  filteredExamples: CodeExample[] = CODE_EXAMPLES;

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

  resetAll(): void {
    this.selectedLanguages = [...this.availableLanguages];
    this.categoryInput = '';
    this.selectedCategory = '';
    this.searchTerm = '';
    this.onFilterChange();
  }

  onLanguageChange(): void {
    // Always clear category when languages change
    this.clearCategory();
  }

  onCategorySelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedCategory = event.option.value;
    this.categoryInput = event.option.value;
    this.onFilterChange();
  }

  onFilterChange(): void {
    const term = this.searchTerm.toLowerCase().trim();
    let results = this.allExamples;

    // Filter by selected languages
    if (this.selectedLanguages.length > 0) {
      results = results.filter(example =>
        this.selectedLanguages.includes(example.language)
      );
    }

    // Filter by selected category
    if (this.selectedCategory) {
      results = results.filter(example =>
        example.categories.includes(this.selectedCategory)
      );
    }

    // Filter by search term - all words must be present
    if (term) {
      const searchWords = term.split(/\s+/).filter(word => word.length > 0);
      results = results.filter(example => {
        const searchableText = (
          example.header +
          ' ' + example.language +
          ' ' + example.body
        ).toLowerCase();
        
        return searchWords.every(word => searchableText.includes(word));
      });
    }

    this.filteredExamples = results;
  }
}
