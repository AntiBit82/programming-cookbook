import { CodeExample, ProgrammingLanguage, Category } from '../models/code-example.model';

export const POSTGRESQL_EXAMPLES: CodeExample[] = [
  {
    language: ProgrammingLanguage.PostgreSQL,
    header: 'How to create recursive/hierarchical queries',
    categories: [Category.Basic],
    description: 'Using WITH RECURSIVE to traverse hierarchical data like organizational structures.',
    sections: [
      {
        title: 'Recursive CTE for Employee Hierarchy',
        hljsLanguage: 'sql',
        body: `-- Create employees table with self-referencing FK
CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100),
    parent_id INTEGER,
    FOREIGN KEY (parent_id) REFERENCES employees(id)
);

-- Sample data: CEO -> Managers -> Employees
INSERT INTO employees VALUES
    (1, 'Alice (CEO)', NULL),
    (2, 'Bob (VP Sales)', 1),
    (3, 'Carol (VP Eng)', 1),
    (4, 'Dan (Sales Rep)', 2),
    (5, 'Eve (Sales Rep)', 2),
    (6, 'Frank (Dev)', 3),
    (7, 'Grace (Dev)', 3);

-- Recursive query to get full hierarchy (top-down traversal)
WITH RECURSIVE employee_hierarchy AS (
    -- BASE CASE: Start with the root node (CEO)
    -- Initial row: Alice (id=1, parent_id=NULL, level=1)
    SELECT 
        id,
        name,
        parent_id,
        1 AS level,
        name AS path
    FROM employees
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- RECURSIVE CASE: Find all children of previous results
    -- How it works:
    -- 1. Take previous results from employee_hierarchy (eh)
    -- 2. Find employees (e) whose parent_id matches eh.id
    -- 3. Add them to the result set with incremented level
    -- 
    -- Iteration 1: eh has Alice (id=1)
    --   → Join finds Bob and Carol (parent_id=1) → Add them with level=2
    -- Iteration 2: eh has Bob and Carol (id=2, id=3)
    --   → Join finds Dan, Eve, Frank, Grace (parent_id=2 or 3) → Add with level=3
    -- Iteration 3: eh has Dan, Eve, Frank, Grace
    --   → No employees have these as parent_id → Recursion stops
    SELECT 
        e.id,
        e.name,
        e.parent_id,
        eh.level + 1,
        eh.path || ' -> ' || e.name  -- Build full path from CEO to employee
    FROM employees e
    INNER JOIN employee_hierarchy eh ON e.parent_id = eh.id
)
-- Final query: Format output with indentation based on level
SELECT 
    REPEAT('  ', level - 1) || name AS hierarchy,
    level,
    path
FROM employee_hierarchy
ORDER BY path;`,
        output: `hierarchy              | level | path
-----------------------|-------|------------------------------------------
Alice (CEO)            |   1   | Alice (CEO)
  Bob (VP Sales)       |   2   | Alice (CEO) -> Bob (VP Sales)
    Dan (Sales Rep)    |   3   | Alice (CEO) -> Bob (VP Sales) -> Dan (Sales Rep)
    Eve (Sales Rep)    |   3   | Alice (CEO) -> Bob (VP Sales) -> Eve (Sales Rep)
  Carol (VP Eng)       |   2   | Alice (CEO) -> Carol (VP Eng)
    Frank (Dev)        |   3   | Alice (CEO) -> Carol (VP Eng) -> Frank (Dev)
    Grace (Dev)        |   3   | Alice (CEO) -> Carol (VP Eng) -> Grace (Dev)`
      },
      {
        title: 'Find all subordinates of a specific manager',
        hljsLanguage: 'sql',
        body: `-- Get all employees under Bob (VP Sales) - top-down from specific node
WITH RECURSIVE subordinates AS (
    -- BASE CASE: Start with the manager we're interested in
    -- Initial row: Bob (id=2, parent_id=1)
    SELECT id, name, parent_id
    FROM employees
    WHERE id = 2
    
    UNION ALL
    
    -- RECURSIVE CASE: Find all direct and indirect reports
    -- How it works:
    -- 1. Take previous results from subordinates (s)
    -- 2. Find employees (e) whose parent_id matches s.id
    -- 3. This gives us direct reports, then their reports, etc.
    -- 
    -- Iteration 1: s has Bob (id=2)
    --   → Join finds Dan and Eve (parent_id=2) → Add them to result
    -- Iteration 2: s has Dan and Eve (id=4, id=5)
    --   → No employees have these as parent_id → Recursion stops
    SELECT e.id, e.name, e.parent_id
    FROM employees e
    INNER JOIN subordinates s ON e.parent_id = s.id
)
SELECT * FROM subordinates;`,
        output: `id | name            | parent_id
---|-----------------|----------
 2 | Bob (VP Sales)  |     1
 4 | Dan (Sales Rep) |     2
 5 | Eve (Sales Rep) |     2`
      },
      {
        title: 'Find path from employee to root',
        hljsLanguage: 'sql',
        body: `-- Get management chain from Grace to CEO (bottom-up traversal)
WITH RECURSIVE management_chain AS (
    -- BASE CASE: Start with Grace (the bottom of the chain)
    -- Initial row: Grace (id=7, parent_id=3, level=1)
    SELECT id, name, parent_id, 1 AS level
    FROM employees
    WHERE name = 'Grace (Dev)'
    
    UNION ALL
    
    -- RECURSIVE CASE: Find the parent of the previous row
    -- How it works:
    -- 1. Take previous result from management_chain (mc)
    -- 2. Find the employee (e) whose id matches mc.parent_id
    -- 3. This gives us the manager one level up
    -- 
    -- Iteration 1: mc has Grace (parent_id=3)
    --   → Join finds Carol (id=3) → Add Carol with level=2
    -- Iteration 2: mc has Carol (parent_id=1)
    --   → Join finds Alice (id=1) → Add Alice with level=3
    -- Iteration 3: mc has Alice (parent_id=NULL)
    --   → No match found → Recursion stops
    SELECT e.id, e.name, e.parent_id, mc.level + 1
    FROM employees e
    INNER JOIN management_chain mc ON mc.parent_id = e.id
)
-- Final query: Show the chain with manager names instead of IDs
SELECT 
    level,
    mc.name,
    COALESCE(e.name, 'Top Level') AS reports_to
FROM management_chain mc
LEFT JOIN employees e ON mc.parent_id = e.id
ORDER BY level;`,
        output: `level | name            | reports_to
------|-----------------|----------------
  1   | Grace (Dev)     | Carol (VP Eng)
  2   | Carol (VP Eng)  | Alice (CEO)
  3   | Alice (CEO)     | Top Level`
      }
    ]
  }
];
