import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CodeExample, highlightCode } from '../../models/code-example.model';

type HighlightedSection = { title: string; code: SafeHtml; usage?: SafeHtml; output?: string };

@Component({
  selector: 'app-code-example-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './code-example-card.component.html',
  styleUrl: './code-example-card.component.css'
})
export class CodeExampleCardComponent implements OnInit {
  
  @Input() example!: CodeExample;
  isExpanded = false;
  highlightedSections: HighlightedSection[] = [];
  copyStates: { [key: string | number]: { icon: string; label: string } } = {};

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.highlightedSections = this.example.sections.map((section, index) => {
      //console.log("Before section:", section);
      this.copyStates[index] = { icon: 'content_copy', label: 'Copy code' };
      const highlighted: HighlightedSection = {
        title: section.title,
        code: this.sanitizer.bypassSecurityTrustHtml(
          highlightCode(section.body, this.example.language)
        ),
        usage: section.usage ? this.sanitizer.bypassSecurityTrustHtml(
          highlightCode(section.usage, this.example.language)
        ) : undefined,
        output: section.output
      };
      //console.log("After highlighted section:", highlighted);
      return highlighted;
    });
  }

  copySectionToClipboard(index: number): void {
    const section = this.example.sections[index];
    navigator.clipboard.writeText(section.body).then(() => {
      this.copyStates[index] = { icon: 'check', label: 'Copied!' };
      setTimeout(() => {
        this.copyStates[index] = { icon: 'content_copy', label: 'Copy code' };
      }, 2000);
    });
  }

  copyUsageToClipboard(index: number): void {
    const section = this.example.sections[index];
    if (section.usage) {
      navigator.clipboard.writeText(section.usage).then(() => {
        // Store usage copy state separately with a unique key
        const usageKey = `usage_${index}`;
        this.copyStates[usageKey] = { icon: 'check', label: 'Copied!' };
        setTimeout(() => {
          this.copyStates[usageKey] = { icon: 'content_copy', label: 'Copy usage' };
        }, 2000);
      });
    }
  }

  getUsageCopyState(index: number): { icon: string; label: string } {
    const usageKey = `usage_${index}`;
    return this.copyStates[usageKey] || { icon: 'content_copy', label: 'Copy usage' };
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  collapse(): void {
    this.isExpanded = false;
  }
}
