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
  highlightedCode: SafeHtml = '';
  copyButtonIcon = 'content_copy';
  copyButtonLabel = 'Copy code';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const highlighted = highlightCode(this.example.body, this.example.language);
    this.highlightedCode = this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.example.body).then(() => {
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
