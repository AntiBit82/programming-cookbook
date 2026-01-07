import { CodeExample, ProgrammingLanguage, Category } from '../models/code-example.model';

export const PYTHON_EXAMPLES: CodeExample[] = [
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
    def wrapper(*args, **kwargs):
        print("Before function call")
        func(*args, **kwargs)
        print("After function call")
    return wrapper

@my_decorator
def say_hello(name: str):
    print(f"Hello {name}!")

say_hello("Antonio")`,
        output: `Before function call
Hello Antonio!
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
        description: `This example demonstrates a simple implementation of the Registry Pattern in Python using decorators to register different data exporters.`,
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
`,
        usage: `sample_data: Data = {"name": "Alice", "age": 30}
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
    language: ProgrammingLanguage.Python,
    header: 'How to create & read Delta tables (managed and unmanaged)',
    categories: [Category.PySpark, Category.Databricks],
    sections: [
      {
        title: 'Create managed Delta table',
        body: `from pyspark.sql import SparkSession, DataFrame

spark = SparkSession.builder.appName("DeltaExample").getOrCreate()

# Sample data
data = [(1, "Alice", 25), (2, "Bob", 30), (3, "Charlie", 35)]
columns = ["id", "name", "age"]
df = spark.createDataFrame(data, columns)

# Managed table - Spark manages both metadata and data
[[MARK]]df.write.format("delta").mode("overwrite").saveAsTable("managed_users")[[/MARK]]`
      },
      {
        title: 'Create unmanaged Delta table (Method 1: saveAsTable() with path option)',
        body: `external_path_1 = "/mnt/delta/unmanaged_users_1"
[[MARK]]df.write.format("delta").mode("overwrite") \\
    .option("path", external_path_1) \\
    .saveAsTable("unmanaged_users_1")[[/MARK]]`
      },
      {
        title: 'Create unmanaged Delta table (Method 2: save() with SQL CREATE TABLE)',
        body: `external_path_2 = "/mnt/delta/unmanaged_users_2"
df.write.format("delta").mode("overwrite").save(external_path_2)
spark.sql(f"""
    CREATE TABLE IF NOT EXISTS unmanaged_users_2
    USING DELTA LOCATION '{external_path_2}'
""")`
      },
      {
        title: 'Create unmanaged Delta table (Method 3: SQL CREATE TABLE AS SELECT)',
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
managed: DataFrame = spark.table("managed_users")
unmanaged: DataFrame = spark.table("unmanaged_users_1")

# Directly from path (no metastore needed)
unmanaged_direct: DataFrame = spark.read.format("delta").load(external_path_1)`
      }
    ]
  }
];
