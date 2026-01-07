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
    header: 'How to create & read Delta Tables (managed and unmanaged)',
    categories: [Category.PySpark, Category.Databricks],
    description: 'Managed: Spark manages both metadata and data. Unmanaged: User provides an EXTERNAL LOCATION, Spark only manages the metadata.',
    sections: [
      {
        title: 'Managed DT #1: saveAsTable()',
        description: 'Save a DataFrame as managed delta table',
        body: `from pyspark.sql import SparkSession, DataFrame

spark = SparkSession.builder.appName("DeltaExample").getOrCreate()

# Sample data
data = [(1, "Alice", 25), (2, "Bob", 30), (3, "Charlie", 35)]
columns = ["id", "name", "age"]
df = spark.createDataFrame(data, columns)

# Managed table - Spark manages both metadata and data
# saveAsTable registers the table in the metastore
[[MARK]]df.write.format("delta").mode("overwrite").saveAsTable("managed_users")[[/MARK]]`
      },
      {
        title: 'Managed DT #2: SQL CREATE TABLE',
        description: 'Create managed empty delta table using SQL',
        body: `# Create managed Delta table with SQL
spark.sql("""
    CREATE TABLE IF NOT EXISTS users_sql (
        id INT,
        name STRING,
        age INT
    )
    USING DELTA
""")`
      },
      {
        title: 'Managed DT #3: SQL CREATE TABLE AS SELECT',
        description: 'Create managed delta table from existing table or view',
        body: `# create a temporary view from existing DataFrame
df.createOrReplaceTempView("temp_data")

# Create managed delta table from the temp view data
# Spark manages both metadata and data location
spark.sql("""
    CREATE TABLE IF NOT EXISTS managed_users_ctas
    USING DELTA
    AS SELECT * FROM temp_data
""")`
      },
      {
        title: 'Unmanaged DT #1: saveAsTable() with path option',
        description: 'Save a DataFrame as unmanaged delta table',
        body: `external_path_1 = "/mnt/delta/unmanaged_users_1"

# saveAsTable registers the table in the metastore but data is stored at external location
[[MARK]]df.write.format("delta").mode("overwrite") \\
    .option("path", external_path_1) \\
    .saveAsTable("unmanaged_users_1")[[/MARK]]`
      },
      {
        title: 'Unmanaged DT #2: save() with SQL CREATE TABLE',
        description: 'Create unmanaged delta table from delta table files which are not registered in metastore',
        body: `external_path_2 = "/mnt/delta/unmanaged_users_2"

# save only writes the delta files but does not register the table in the metastore
df.write.format("delta").mode("overwrite").save(external_path_2)

# Now register the unmanaged delta table in metastore pointing to the external location
spark.sql(f"""
    CREATE TABLE IF NOT EXISTS unmanaged_users_2
    USING DELTA LOCATION '{external_path_2}'
""")`
      },
      {
        title: 'Unmanaged DT #3: Create with SQL',
        description: 'Unmanaged DT #3: Create either new empty unmanaged delta table or register existing delta files (schema must match)',
        body: `# Create unmanaged Delta table with SQL
# registers the table in metastore but data is stored at external location
spark.sql("""
    CREATE TABLE IF NOT EXISTS users_external (
        id INT,
        name STRING,
        age INT
    )
    USING DELTA
    LOCATION '/mnt/delta/users_external'
""")`
      },
      {
        title: 'Unmanaged DT #4: SQL CREATE TABLE AS SELECT',
        description: 'Create unmanaged delta table from existing table or view',
        body: `external_path_4 = "/mnt/delta/unmanaged_users_4"

# create a temporary view from existing DataFrame
df.createOrReplaceTempView("temp_data")

# Now create unmanaged delta table from the temp view data
# table is registered in metastore but data is stored at external location
spark.sql(f"""
    CREATE TABLE IF NOT EXISTS unmanaged_users_4
    USING DELTA LOCATION '{external_path_4}'
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
  },
  {
    language: ProgrammingLanguage.Python,
    header: 'How to update Delta Table records',
    categories: [Category.PySpark, Category.Databricks],
    sections: [
      {
        title: 'Create sample Delta table',
        description: 'First, create a Delta table that we will update in the following examples.',
        body: `from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("DeltaUpdate").getOrCreate()

# Create sample data
data = [
    ("FINANCE", "Financial data domain", "active"),
    ("MARKETING", "Marketing data domain", "active"),
    ("HR", "Human resources domain", "active")
]
df = spark.createDataFrame(data, ["domain_code", "description", "status"])

# Create Delta table
df.write.format("delta").mode("overwrite").saveAsTable("data_domains")

# Verify
spark.table("data_domains").show()`
      },
      {
        title: 'Method 1: Using DeltaTable API with forName()',
        description: 'Update records using the DeltaTable API with a table registered in the metastore.',
        body: `from delta.tables import DeltaTable
from pyspark.sql.functions import lit

# Load the Delta table by name
dt = DeltaTable.forName(spark, "data_domains")

# Update matching records
dt.update(
    condition="domain_code = 'FINANCE'",
    set={"description": lit("Updated financial domain")}
)`
      },
      {
        title: 'Method 2: Using DeltaTable API with forPath()',
        description: 'Update records using the DeltaTable API with a direct path (no metastore needed).',
        body: `from delta.tables import DeltaTable
from pyspark.sql.functions import lit

# Load the Delta table by path
dt = DeltaTable.forPath(spark, "/mnt/delta/data_domains")

# Update with multiple columns
dt.update(
    condition="domain_code = 'FINANCE' AND status = 'active'",
    set={
        "description": lit("Updated financial domain"),
        "status": lit("reviewed")
    }
)`
      },
      {
        title: 'Method 3: Using SQL UPDATE statement',
        description: 'Update records using standard SQL UPDATE syntax.',
        body: `# Simple UPDATE
spark.sql("""
    UPDATE data_domains
    SET description = 'Marketing data domain'
    WHERE domain_code = 'MARKETING'
""")

# UPDATE multiple columns
spark.sql("""
    UPDATE data_domains
    SET 
        description = 'Updated HR domain',
        status = 'reviewed'
    WHERE domain_code = 'HR'
""")`
      },
      {
        title: 'Method 4: Using MERGE (upsert)',
        description: 'Update if exists, insert if not exists.',
        body: `from delta.tables import DeltaTable

# Source data with updates
updates_df = spark.createDataFrame([
    ("FINANCE", "Updated Financial domain"),
    ("NEWDOMAIN", "Brand new domain")
], ["domain_code", "description"])

# Load target table and merge
target = DeltaTable.forName(spark, "data_domains")

target.alias("t").merge(
    updates_df.alias("u"),
    "t.domain_code = u.domain_code"
).whenMatchedUpdate(
    set={"description": "u.description"}
).whenNotMatchedInsert(
    values={"domain_code": "u.domain_code", "description": "u.description"}
).execute()`
      },
      {
        title: 'Method 5: Using SQL MERGE statement',
        description: 'Alternative to DeltaTable API - uses SQL MERGE syntax for upsert.',
        body: `# Source data with updates
updates_df = spark.createDataFrame([
    ("FINANCE", "Updated Financial domain"),
    ("NEWDOMAIN", "Brand new domain")
], ["domain_code", "description"])

# Create temp view from updates DataFrame
updates_df.createOrReplaceTempView("updates")

# SQL MERGE - functionally equivalent to DeltaTable API merge
spark.sql("""
    MERGE INTO data_domains t
    USING updates u
    ON t.domain_code = u.domain_code
    WHEN MATCHED THEN 
        UPDATE SET t.description = u.description
    WHEN NOT MATCHED THEN 
        INSERT (domain_code, description) 
        VALUES (u.domain_code, u.description)
""")`
      }
    ]
  }
];
