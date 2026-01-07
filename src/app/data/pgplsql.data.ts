import { CodeExample, ProgrammingLanguage, Category } from '../models/code-example.model';

export const PGPLSQL_EXAMPLES: CodeExample[] = [
  {
    language: ProgrammingLanguage.PgPLSQL,
    header: 'How to create a simple function',
    categories: [Category.Basic],
    sections: [
      {
        title: 'Function to calculate total price',
        body: `CREATE OR REPLACE FUNCTION calculate_total(
    quantity INTEGER,
    price NUMERIC
) RETURNS NUMERIC AS $$
BEGIN
    RETURN quantity * price;
END;
$$ LANGUAGE plpgsql;`,
        usage: `SELECT calculate_total(5, 19.99) AS total;
-- Result: 99.95`
      }
    ]
  },
  {
    language: ProgrammingLanguage.PgPLSQL,
    header: 'How to use a loop in PL/pgSQL',
    categories: [Category.Basic],
    sections: [
      {
        title: 'Function with a FOR loop',
        body: `CREATE OR REPLACE FUNCTION generate_series_sum(
    start_num INTEGER,
    end_num INTEGER
) RETURNS INTEGER AS $$
DECLARE
    total INTEGER := 0;
    i INTEGER;
BEGIN
    FOR i IN start_num..end_num LOOP
        total := total + i;
    END LOOP;
    RETURN total;
END;
$$ LANGUAGE plpgsql;`,
        usage: `SELECT generate_series_sum(1, 10) AS sum;
-- Result: 55`
      }
    ]
  }
];
