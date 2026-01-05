import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CodeExample } from '../models/code-example.model';
import { CODE_EXAMPLES } from '../data/code-examples.data';

@Injectable({
  providedIn: 'root'
})
export class CodeExampleService {
  
  /**
   * Get all code examples
   * Currently returns hardcoded data, but can be easily changed to HTTP call
   * @returns Observable of CodeExample array
   */
  getExamples(): Observable<CodeExample[]> {
    return of(CODE_EXAMPLES);
  }
}
