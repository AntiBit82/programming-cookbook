import { CodeExample, ProgrammingLanguage, Category } from '../models/code-example.model';

export const CODE_EXAMPLES: CodeExample[] = [
  {
    language: ProgrammingLanguage.Java,
    header: 'How to use lambda functions',
    categories: [Category.Basic],
    sections: [
      {
        title: 'Lambda expression for filtering',
        body: `List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// Using lambda to filter and print even numbers
numbers.stream()
    .filter(n -> n % 2 == 0)
    .forEach(n -> System.out.println(n));`
      },
      {
        title: 'Lambda with multiple parameters',
        body: `BinaryOperator<Integer> add = (a, b) -> a + b;
int result = add.apply(5, 3); // result = 8`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Python,
    header: 'How to use list comprehensions',
    categories: [Category.Basic],
    sections: [
      {
        title: 'Basic list comprehension',
        body: `numbers = [1, 2, 3, 4, 5]
squares = [n**2 for n in numbers]
print(squares)  # [1, 4, 9, 16, 25]`
      },
      {
        title: 'List comprehension with condition',
        body: `even_squares = [n**2 for n in numbers if n % 2 == 0]
print(even_squares)  # [4, 16]`
      },
      {
        title: 'Nested list comprehension',
        body: `matrix = [[i*j for j in range(1, 4)] for i in range(1, 4)]
print(matrix)  # [[1, 2, 3], [2, 4, 6], [3, 6, 9]]`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Python,
    header: 'How to use lambda functions',
    categories: [Category.Basic],
    sections: [
      {
        title: 'Simple lambda function',
        body: `add = lambda x, y: x + y
result = add(5, 3)  # result = 8`
      },
      {
        title: 'Lambda with map',
        body: `numbers = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x * 2, numbers))
print(doubled)  # [2, 4, 6, 8, 10]`
      },
      {
        title: 'Lambda with filter',
        body: `evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4]`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Python,
    header: 'How to create and use decorators',
    categories: [Category.Basic],
    sections: [
      {
        title: 'Basic decorator',
        body: `def my_decorator(func):
    def wrapper():
        print("Before function call")
        func()
        print("After function call")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()`,
        output: `Before function call
Hello!
After function call`
      },
      {
        title: 'Decorator with arguments',
        body: `def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")`,
        output: `Hello, Alice!
Hello, Alice!
Hello, Alice!`
      },
      {
        title: 'Preserving function metadata',
        body: `from functools import wraps
import time

def timing_decorator(func):
    @wraps(func) # This will preserve the original function's metadata
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.2f}s")
        return result
    return wrapper`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Python,
    header: 'How to implement the Registry Pattern',
    categories: [Category.Basic],
    sections: [
      {
        title: 'Registry Pattern Example',
        body: `from functools import wraps
from typing import Any, Callable

type Data = dict[str, Any]
type ExportFn = Callable[[Data], None]

# The registry which maps format names to export functions
exporters: dict[str, ExportFn] = {}

# Our decorator to register exporters
def register_exporter(name: str):
    def decorator(func: ExportFn):
        @wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            return func(*args, **kwargs)
        
        exporters[name] = wrapper
        return wrapper
    
    return decorator


@register_exporter("pdf")
def export_pdf(data: Data) -> None:
    print(f"Exporting data to PDF: {data}")


@register_exporter("csv")
def export_csv(data: Data) -> None:
    print(f"Exporting data to CSV: {data}")


@register_exporter("json")
def export_json(data: Data) -> None:
    import json
    print("Exporting data to JSON:")
    print(json.dumps(data, indent=2))


def export_data(data: Data, format: str) -> None:
    exporter = exporters.get(format)
    if exporter is None:
        raise ValueError(f"No exporter found for format: {format}")
    exporter(data)


# Usage
sample_data: Data = {"name": "Alice", "age": 30}
export_data(sample_data, "pdf")
export_data(sample_data, "csv")
export_data(sample_data, "json")`,
        output: `Exporting data to PDF: {'name': 'Alice', 'age': 30}
Exporting data to CSV: {'name': 'Alice', 'age': 30}
Exporting data to JSON:
{
  "name": "Alice",
  "age": 30
}`
      }
    ]
  },
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
$$ LANGUAGE plpgsql;`
      },
      {
        title: 'Usage',
        body: `SELECT calculate_total(5, 19.99) AS total;
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
$$ LANGUAGE plpgsql;`
      },
      {
        title: 'Usage',
        body: `SELECT generate_series_sum(1, 10) AS sum;
-- Result: 55`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Java,
    header: 'How to create a HashMap',
    categories: [Category.Basic],
    sections: [
      {
        title: 'Creating and populating a HashMap',
        body: `import java.util.HashMap;
import java.util.Map;

Map<String, Integer> ages = new HashMap<>();

// Adding entries
ages.put("Alice", 25);
ages.put("Bob", 30);
ages.put("Charlie", 35);`
      },
      {
        title: 'Retrieving and iterating',
        body: `// Retrieving values
int bobAge = ages.get("Bob"); // 30

// Iterating over entries
ages.forEach((name, age) -> 
    System.out.println(name + " is " + age + " years old")
);`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Java,
    header: 'How to create auto generated ids',
    categories: [Category.Hibernate],
    sections: [
      {
        title: 'Entity with auto-generated ID',
        body: `import javax.persistence.*;

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
      }
    ]
  },
  {
    language: ProgrammingLanguage.Python,
    header: 'How to create Delta tables (managed and unmanaged)',
    categories: [Category.PySpark, Category.Databricks],
    sections: [
      {
        title: 'Create a managed Delta table',
        body: `from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("DeltaExample").getOrCreate()

# Sample data
data = [(1, "Alice", 25), (2, "Bob", 30), (3, "Charlie", 35)]
columns = ["id", "name", "age"]
df = spark.createDataFrame(data, columns)

# Managed table - Spark manages both metadata and data
df.write.format("delta").mode("overwrite").saveAsTable("managed_users")`
      },
      {
        title: 'Method 1: saveAsTable with path option',
        body: `external_path_1 = "/mnt/delta/unmanaged_users_1"
df.write.format("delta").mode("overwrite") \\
    .option("path", external_path_1) \\
    .saveAsTable("unmanaged_users_1")`
      },
      {
        title: 'Method 2: save() then CREATE TABLE',
        body: `external_path_2 = "/mnt/delta/unmanaged_users_2"
df.write.format("delta").mode("overwrite").save(external_path_2)
spark.sql(f"""
    CREATE TABLE IF NOT EXISTS unmanaged_users_2
    USING DELTA LOCATION '{external_path_2}'
""")`
      },
      {
        title: 'Method 3: Pure SQL approach',
        body: `external_path_3 = "/mnt/delta/unmanaged_users_3"
df.createOrReplaceTempView("temp_data")
spark.sql(f"""
    CREATE TABLE IF NOT EXISTS unmanaged_users_3
    USING DELTA LOCATION '{external_path_3}'
    AS SELECT * FROM temp_data
""")`
      },
      {
        title: 'Reading from Delta tables',
        body: `# Via metastore (works for both managed and unmanaged registered tables)
managed = spark.table("managed_users")
unmanaged = spark.table("unmanaged_users_1")

# Directly from path (no metastore needed)
unmanaged_direct = spark.read.format("delta").load(external_path_1)`
      }
    ]
  }
];
