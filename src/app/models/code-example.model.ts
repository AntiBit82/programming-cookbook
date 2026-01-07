import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

// Register languages
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);

export enum ProgrammingLanguage {
  Angular = 'Angular',
  Java = 'Java',
  PgPLSQL = 'PL/pgSQL',
  Python = 'Python'
}

export enum Category {
  Basic = 'Basic',
  Databricks = 'Databricks',
  Hibernate = 'Hibernate',
  Multithreading = 'Multithreading',
  PySpark = 'PySpark',
  ReactiveForms = 'Reactive Forms',
  Routing = 'Routing',
}

export interface CodeSection {
  title: string;
  description?: string;
  codeLabel?: string;
  hljsLanguage?: string; // Optional highlight.js language override for this section
  body: string;
  usage?: string;
  output?: string;
}

export interface CodeExample {
  language: ProgrammingLanguage;
  header: string;
  description?: string;
  sections: CodeSection[];
  categories: Category[];
  downloadUrl?: string;
}

const LANGUAGE_MAP: { [key: string]: string } = {
  'Angular': 'typescript',
  'Python': 'python',
  'Java': 'java',
  'PgPLSQL': 'sql'
};

export function highlightCode(code: string, hljsLanguage: string): string {
  // Find all [[MARK]]...[[/MARK]] sections and replace with unique placeholders
  const markedSections: string[] = [];
  let processedCode = code;
  
  // Replace each marked section with a unique placeholder
  let counter = 0;
  while (true) {
    const startIdx = processedCode.indexOf('[[MARK]]');
    if (startIdx === -1) break;
    
    const endIdx = processedCode.indexOf('[[/MARK]]', startIdx);
    if (endIdx === -1) break;
    
    const content = processedCode.substring(startIdx + 8, endIdx);
    const placeholder = `___PLACEHOLDER_${counter}___`;
    
    markedSections.push(content);
    processedCode = processedCode.substring(0, startIdx) + placeholder + processedCode.substring(endIdx + 9);
    counter++;
  }
  
  // Highlight the code with placeholders
  const highlighted = hljs.highlight(processedCode, { language: hljsLanguage }).value;
  
  // Replace each placeholder with the highlighted version of its content wrapped in mark tags
  let result = highlighted;
  markedSections.forEach((content, index) => {
    const placeholder = `___PLACEHOLDER_${index}___`;
    
    // Highlight just this content
    const highlightedContent = hljs.highlight(content, { language: hljsLanguage }).value;
    
    // Replace the placeholder with marked content
    result = result.replace(placeholder, `<mark>${highlightedContent}</mark>`);
  });
  
  return result;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
