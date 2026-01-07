import { CodeExample } from '../models/code-example.model';
import { ANGULAR_EXAMPLES } from './angular.data';
import { JAVA_EXAMPLES } from './java.data';
import { PYTHON_EXAMPLES } from './python.data';
import { PGPLSQL_EXAMPLES } from './pgplsql.data';

export const CODE_EXAMPLES: CodeExample[] = [
  ...ANGULAR_EXAMPLES,
  ...JAVA_EXAMPLES,
  ...PYTHON_EXAMPLES,
  ...PGPLSQL_EXAMPLES
];
