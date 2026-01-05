import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import sql from 'highlight.js/lib/languages/sql';

// Register languages
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('sql', sql);

export enum ProgrammingLanguage {
  Python = 'Python',
  Java = 'Java',
  PgPLSQL = 'PgPLSQL'
}

export enum Category {
  Basic = 'Basic',
  Databricks = 'Databricks',
  Hibernate = 'Hibernate',
  PySpark = 'PySpark'
}

export interface CodeSection {
  title: string;
  body: string;
  output?: string;
}

export interface CodeExample {
  language: ProgrammingLanguage;
  header: string;
  sections: CodeSection[];
  categories: Category[];
}

const LANGUAGE_MAP: { [key: string]: string } = {
  'Python': 'python',
  'Java': 'java',
  'PgPLSQL': 'sql'
};

export function highlightCode(code: string, language: ProgrammingLanguage): string {
  const hljsLanguage = LANGUAGE_MAP[language] || 'sql';
  return hljs.highlight(code, { language: hljsLanguage }).value;
}
