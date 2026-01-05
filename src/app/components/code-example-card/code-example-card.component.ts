import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CodeExample, highlightCode } from '../../models/code-example.model';

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
  highlightedSections: { title: string; code: SafeHtml }[] = [];
  copyButtonIcon = 'content_copy';
  copyButtonLabel = 'Copy code';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.highlightedSections = this.example.sections.map(section => ({
      title: section.title,
      code: this.sanitizer.bypassSecurityTrustHtml(
        highlightCode(section.body, this.example.language)
      )
    }));
  }

  copyToClipboard(): void {
    const allCode = this.example.sections.map(s => s.body).join('\n\n');
    navigator.clipboard.writeText(allCode).then(() => {
      this.copyButtonIcon = 'check';
      this.copyButtonLabel = 'Copied!';
      setTimeout(() => {
        this.copyButtonIcon = 'content_copy';
        this.copyButtonLabel = 'Copy code';
      }, 2000);
    });
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  collapse(): void {
    this.isExpanded = false;
  }
}
