import { CodeExample } from '../models/code-example.model';
import { ANGULAR_EXAMPLES } from './angular.data';
import { GIT_EXAMPLES } from './git.data';
import { JAVA_EXAMPLES } from './java.data';
import { PYTHON_EXAMPLES } from './python.data';
import { PGPLSQL_EXAMPLES } from './pgplsql.data';
import { POSTGRESQL_EXAMPLES } from './postgresql.data';
import { PYSPARK_EXAMPLES } from './pyspark.data';

export const CODE_EXAMPLES: CodeExample[] = [
  ...ANGULAR_EXAMPLES,
  ...GIT_EXAMPLES,
  ...JAVA_EXAMPLES,
  ...PYTHON_EXAMPLES,
  ...PYSPARK_EXAMPLES,
  ...PGPLSQL_EXAMPLES,
  ...POSTGRESQL_EXAMPLES
];
