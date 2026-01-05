import { CodeExample, ProgrammingLanguage, Category } from '../models/code-example.model';

export const CODE_EXAMPLES: CodeExample[] = [
  {
    language: ProgrammingLanguage.Java,
    header: 'How to use lambda functions',
    categories: [Category.Basic],
    body: `// Lambda expression for a simple operation
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// Using lambda to filter and print even numbers
numbers.stream()
    .filter(n -> n % 2 == 0)
    .forEach(n -> System.out.println(n));

// Lambda with multiple parameters
BinaryOperator<Integer> add = (a, b) -> a + b;
int result = add.apply(5, 3); // result = 8`
  },
  {
    language: ProgrammingLanguage.Python,
    header: 'How to use list comprehensions',
    categories: [Category.Basic],
    body: `# Basic list comprehension
numbers = [1, 2, 3, 4, 5]
squares = [n**2 for n in numbers]
print(squares)  # [1, 4, 9, 16, 25]

# List comprehension with condition
even_squares = [n**2 for n in numbers if n % 2 == 0]
print(even_squares)  # [4, 16]

# Nested list comprehension
matrix = [[i*j for j in range(1, 4)] for i in range(1, 4)]
print(matrix)  # [[1, 2, 3], [2, 4, 6], [3, 6, 9]]`
  },
  {
    language: ProgrammingLanguage.Python,
    header: 'How to use lambda functions',
    categories: [Category.Basic],
    body: `# Simple lambda function
add = lambda x, y: x + y
result = add(5, 3)  # result = 8

# Lambda with map
numbers = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x * 2, numbers))
print(doubled)  # [2, 4, 6, 8, 10]

# Lambda with filter
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4]`
  },
  {
    language: ProgrammingLanguage.PgPLSQL,
    header: 'How to create a simple function',
    categories: [Category.Basic],
    body: `-- Create a function to calculate total price
CREATE OR REPLACE FUNCTION calculate_total(
    quantity INTEGER,
    price NUMERIC
) RETURNS NUMERIC AS $$
BEGIN
    RETURN quantity * price;
END;
$$ LANGUAGE plpgsql;

-- Usage
SELECT calculate_total(5, 19.99) AS total;
-- Result: 99.95`
  },
  {
    language: ProgrammingLanguage.PgPLSQL,
    header: 'How to use a loop in PL/pgSQL',
    categories: [Category.Basic],
    body: `-- Function with a FOR loop
CREATE OR REPLACE FUNCTION generate_series_sum(
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
$$ LANGUAGE plpgsql;

-- Usage
SELECT generate_series_sum(1, 10) AS sum;
-- Result: 55`
  },
  {
    language: ProgrammingLanguage.Java,
    header: 'How to create a HashMap',
    categories: [Category.Basic],
    body: `// Creating and using a HashMap
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> ages = new HashMap<>();

// Adding entries
ages.put("Alice", 25);
ages.put("Bob", 30);
ages.put("Charlie", 35);

// Retrieving values
int bobAge = ages.get("Bob"); // 30

// Iterating over entries
ages.forEach((name, age) -> 
    System.out.println(name + " is " + age + " years old")
);`
  },
  {
    language: ProgrammingLanguage.Java,
    header: 'How to create auto generated ids',
    categories: [Category.Hibernate],
    body: `// Entity with auto-generated ID
import javax.persistence.*;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "username", nullable = false)
    private String username;
    
    @Column(name = "email")
    private String email;
    
    // Constructors, getters, and setters
    public User() {}
    
    public User(String username, String email) {
        this.username = username;
        this.email = email;
    }
    
    public Long getId() {
        return id;
    }
    
    // Other getters and setters...
}`
  },
  {
    language: ProgrammingLanguage.Python,
    header: 'How to create Delta tables (managed and unmanaged)',
    categories: [Category.PySpark, Category.Databricks],
    body: `# Create a managed Delta table
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("DeltaExample").getOrCreate()

# Sample data
data = [(1, "Alice", 25), (2, "Bob", 30), (3, "Charlie", 35)]
columns = ["id", "name", "age"]
df = spark.createDataFrame(data, columns)

# Managed table - Spark manages both metadata and data
df.write.format("delta").mode("overwrite").saveAsTable("managed_users")

# Unmanaged (external) tables - three different ways:

# Method 1: saveAsTable with path option
external_path_1 = "/mnt/delta/unmanaged_users_1"
df.write.format("delta").mode("overwrite") \\
    .option("path", external_path_1) \\
    .saveAsTable("unmanaged_users_1")

# Method 2: save() then CREATE TABLE
external_path_2 = "/mnt/delta/unmanaged_users_2"
df.write.format("delta").mode("overwrite").save(external_path_2)
spark.sql(f"""
    CREATE TABLE IF NOT EXISTS unmanaged_users_2
    USING DELTA LOCATION '{external_path_2}'
""")

# Method 3: Pure SQL approach
external_path_3 = "/mnt/delta/unmanaged_users_3"
df.createOrReplaceTempView("temp_data")
spark.sql(f"""
    CREATE TABLE IF NOT EXISTS unmanaged_users_3
    USING DELTA LOCATION '{external_path_3}'
    AS SELECT * FROM temp_data
""")

# Reading from Delta tables
# Via metastore (works for both managed and unmanaged registered tables)
managed = spark.table("managed_users")
unmanaged = spark.table("unmanaged_users_1")

# Directly from path (no metastore needed)
unmanaged_direct = spark.read.format("delta").load(external_path_1)`
  }
];
