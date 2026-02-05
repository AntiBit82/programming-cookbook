import { CodeExample, ProgrammingLanguage, Category } from '../models/code-example.model';

export const PYTHON_EXAMPLES: CodeExample[] = [
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
    header: 'How to use some of the most important __xxx__ (dunder) methods',
    categories: [Category.Basic],
    sections: [
      {
        title: '__init__ - Object initialization',
        description: 'Consructor, called when creating a new instance of a class, used to initialize object attributes',
        body: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

person = Person("Alice", 30)
print(f"{person.name}, {person.age}")`,
        output: `Alice, 30`
      },
      {
        title: '__str__ - String representation for users',
        description: 'Returns a user-friendly string representation, called by print() and str()',
        body: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __str__(self):
        return f"Person: {self.name}, Age: {self.age}"

person = Person("Bob", 25)
print(person)
print(str(person))`,
        output: `Person: Bob, Age: 25
Person: Bob, Age: 25`
      },
      {
        title: '__repr__ - String representation for developers',
        description: 'Returns an unambiguous string representation for debugging, ideally valid Python code to recreate the object. Without __str__, print() falls back to __repr__(). Containers always use __repr__ for their items',
        body: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __repr__(self):
        return f"Person(name='{self.name}', age={self.age})"

person = Person("Charlie", 35)
print(repr(person))
print([person])  # Lists always use __repr__ for items`,
        output: `Person(name='Charlie', age=35)
[Person(name='Charlie', age=35)]`
      },
      {
        title: '__len__ - Length of an object',
        description: 'Called by len() function to return the number of items in an object',
        body: `class Playlist:
    def __init__(self, songs):
        self.songs = songs
    
    def __len__(self):
        return len(self.songs)

playlist = Playlist(["Song1", "Song2", "Song3"])
print(len(playlist))`,
        output: `3`
      },
      {
        title: '__getitem__ - Access items by index or key',
        description: 'Enables bracket notation access (obj[key]). Python\'s fallback iteration protocol allows "for x in obj" without __iter__ by calling __getitem__(0, 1, 2...) until IndexError',
        body: `class Playlist:
    def __init__(self, songs):
        self.songs = songs
    
    def __getitem__(self, index):
        return self.songs[index]

playlist = Playlist(["Rock", "Jazz", "Pop"])
print(playlist[0])
print(playlist[1])

# Also works with for loop without __iter__
for song in playlist:
    print(song)`,
        output: `Rock
Jazz
Rock
Jazz
Pop`
      },
      {
        title: '__setitem__ - Set items by index or key',
        description: 'Enables assignment using bracket notation (obj[key] = value)',
        body: `class Playlist:
    def __init__(self, songs):
        self.songs = songs
    
    def __setitem__(self, index, value):
        self.songs[index] = value

playlist = Playlist(["Rock", "Jazz", "Pop"])
playlist[1] = "Classical"
print(playlist.songs)`,
        output: `['Rock', 'Classical', 'Pop']`
      },
      {
        title: '__call__ - Make object callable like a function',
        description: 'Allows an instance to be called like a function using parentheses',
        body: `class Multiplier:
    def __init__(self, factor):
        self.factor = factor
    
    def __call__(self, x):
        return x * self.factor

multiply_by_3 = Multiplier(3)
print(multiply_by_3(5))
print(multiply_by_3(10))`,
        output: `15
30`
      },
      {
        title: '__eq__ - Equality comparison',
        description: 'Without __eq__, Python uses identity comparison (is). So p1 == p2 would be False (different objects in memory). With __eq__, we define equality based on values',
        body: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

p1 = Point(1, 2)
p2 = Point(1, 2)
p3 = Point(3, 4)
print(p1 == p2)
print(p1 == p3)`,
        output: `True
False`
      },
      {
        title: '__lt__, __le__, __gt__, __ge__ - Comparison operators',
        description: 'Define less than (<), less than or equal (<=), greater than (>), and greater than or equal (>=) comparisons',
        body: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __lt__(self, other):
        return self.age < other.age
    
    def __le__(self, other):
        return self.age <= other.age
    
    def __gt__(self, other):
        return self.age > other.age
    
    def __ge__(self, other):
        return self.age >= other.age

alice = Person("Alice", 30)
bob = Person("Bob", 25)
print(alice > bob)
print(bob < alice)`,
        output: `True
True`
      },
      {
        title: '__add__, __sub__, __mul__, __truediv__ - Arithmetic operators',
        description: 'Defines behavior for the + operator, or -, *, / operators respectively. Python doesn\'t enforce return type - you can return anything, but best practice is to return the same type for predictability and to allow chaining (e.g., v1 + v2 + v3)',
        body: `class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    
    def __repr__(self):
        return f"Vector(x={self.x}, y={self.y})"

v1 = Vector(1, 2)
v2 = Vector(3, 4)
v3 = v1 + v2
print(v3)`,
        output: `Vector(x=4, y=6)`
      },
      {
        title: '__enter__ and __exit__ - Context manager',
        description: 'Implements the context manager protocol for use with "with" statements, ensuring proper resource cleanup',
        body: `class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()

# Usage
with FileManager('test.txt', 'w') as f:
    f.write('Hello, World!')
print("File closed automatically")`,
        output: `File closed automatically`
      },
      {
        title: '__iter__ and __next__ - Make object iterable',
        description: 'Implements the iterator protocol, allowing objects to be used in for loops',
        body: `class Counter:
    def __init__(self, max_value):
        self.max_value = max_value
        self.current = 0
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.current < self.max_value:
            self.current += 1
            return self.current
        raise StopIteration

counter = Counter(3)
for num in counter:
    print(num)`,
        output: `1
2
3`
      },
      {
        title: '__getattr__ - Dynamic attribute access',
        description: 'Called when an attribute is not found through normal lookup, allows dynamic attribute handling',
        body: `class DynamicObject:
    def __init__(self):
        self.existing = "I exist"
    
    def __getattr__(self, name):
        return f"Attribute '{name}' doesn't exist, returning this instead"

obj = DynamicObject()
print(obj.existing)
print(obj.non_existent)
print(obj.another_missing)`,
        output: `I exist
Attribute 'non_existent' doesn't exist, returning this instead
Attribute 'another_missing' doesn't exist, returning this instead`
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
    header: 'How to create Delta, Parquet, and CSV managed/unmanaged tables',
    categories: [Category.PySpark, Category.Databricks],
    description: 'Managed: Spark manages both metadata and data. Unmanaged: User provides an EXTERNAL LOCATION, Spark only manages the metadata.',
    sections: [
      {
        title: 'Managed table #1: saveAsTable()',
        description: 'Save a DataFrame as managed table',
        body: `from pyspark.sql import SparkSession, DataFrame

spark = SparkSession.builder.appName("DeltaExample").getOrCreate()

# Sample data
data = [(1, "Alice", 25), (2, "Bob", 30), (3, "Charlie", 35)]
columns = ["id", "name", "age"]
df = spark.createDataFrame(data, columns)

# Managed table - Spark manages both metadata and data
# saveAsTable registers the table in the metastore

# Create Delta table
[[MARK]]df.write.format("delta").mode("overwrite").saveAsTable("managed_users")[[/MARK]]

# Create Parquet table
df.write.format("parquet").mode("overwrite").saveAsTable("managed_users_parquet")

# Create CSV table
df.write.format("csv").mode("overwrite").option("header", "true").saveAsTable("managed_users_csv")`
      },
      {
        title: 'Managed table #2: SQL CREATE (Empty Table)',
        description: 'Create managed empty table using SQL',
        body: `# Create managed Delta table with SQL
spark.sql("""
    CREATE TABLE IF NOT EXISTS users_sql (
        id INT,
        name STRING,
        age INT
    )
    USING DELTA
""")

# Create managed Parquet table with SQL
spark.sql("""
    CREATE TABLE IF NOT EXISTS users_sql_parquet (
        id INT,
        name STRING,
        age INT
    )
    USING PARQUET
""")

# Create managed CSV table with SQL (with manual schema)
spark.sql("""
    CREATE TABLE IF NOT EXISTS users_sql_csv (
        id INT,
        name STRING,
        age INT
    )
    USING CSV
    OPTIONS (header 'true')
""")`
      },
      {
        title: 'Managed table #3: SQL CREATE TABLE AS SELECT',
        description: 'Create managed table from existing table or view',
        body: `# create a temporary view from existing DataFrame
df.createOrReplaceTempView("temp_data")

# Create managed delta table from the temp view data
# Spark manages both metadata and data location
spark.sql("""
    CREATE TABLE IF NOT EXISTS managed_users_ctas
    USING DELTA
    AS SELECT * FROM temp_data
""")

# Create managed Parquet table from the temp view data
spark.sql("""
    CREATE TABLE IF NOT EXISTS managed_users_ctas_parquet
    USING PARQUET
    AS SELECT * FROM temp_data
""")

# Create managed CSV table from the temp view data (schema comes from SELECT)
spark.sql("""
    CREATE TABLE IF NOT EXISTS managed_users_ctas_csv
    USING CSV
    OPTIONS (header 'true')
    AS SELECT * FROM temp_data
""")`
      },
      {
        title: 'Unmanaged table #1: saveAsTable() with path option',
        description: 'Save a DataFrame as unmanaged table',
        body: `external_path_1 = "/mnt/delta/unmanaged_users_1"

# saveAsTable registers the table in the metastore but data is stored at external location
# Create unmanaged Delta table
[[MARK]]df.write.format("delta").mode("overwrite") \\
    .option("path", external_path_1) \\
    .saveAsTable("unmanaged_users_1")[[/MARK]]

# Create unmanaged Parquet table
external_path_1_parquet = "/mnt/parquet/unmanaged_users_1"
df.write.format("parquet").mode("overwrite") \\
    .option("path", external_path_1_parquet) \\
    .saveAsTable("unmanaged_users_1_parquet")

# Create unmanaged CSV table
external_path_1_csv = "/mnt/csv/unmanaged_users_1"
df.write.format("csv").mode("overwrite") \\
    .option("path", external_path_1_csv) \\
    .option("header", "true") \\
    .saveAsTable("unmanaged_users_1_csv")`
      },
      {
        title: 'Unmanaged table #2: Register existing files as table (Schema can be ommitted for Delta/Parquet)',
        description: 'Create unmanaged table from files which are not registered in metastore',
        body: `external_path_2 = "/mnt/delta/unmanaged_users_2"

# save only writes the delta files but does not register the table in the metastore
df.write.format("delta").mode("overwrite").save(external_path_2)

# Now register the unmanaged delta table in metastore pointing to the external location
spark.sql(f"""
    CREATE TABLE IF NOT EXISTS unmanaged_users_2
    USING DELTA LOCATION '{external_path_2}'
""")

# Create unmanaged Parquet table with save() + SQL
external_path_2_parquet = "/mnt/parquet/unmanaged_users_2"
df.write.format("parquet").mode("overwrite").save(external_path_2_parquet)
spark.sql(f"""
    CREATE TABLE IF NOT EXISTS unmanaged_users_2_parquet
    USING PARQUET LOCATION '{external_path_2_parquet}'
""")

# Create unmanaged CSV table with save() + SQL (must specify schema when registering)
external_path_2_csv = "/mnt/csv/unmanaged_users_2"
df.write.format("csv").mode("overwrite").option("header", "true").save(external_path_2_csv)
spark.sql(f"""
    CREATE TABLE IF NOT EXISTS unmanaged_users_2_csv (
        id INT,
        name STRING,
        age INT
    )
    USING CSV LOCATION '{external_path_2_csv}'
    OPTIONS (header 'true')
""")

# Alternative: Let Spark infer schema (not recommended - slower, less reliable)
# spark.sql(f"""
#     CREATE TABLE IF NOT EXISTS unmanaged_users_2_csv
#     USING CSV LOCATION '{external_path_2_csv}'
#     OPTIONS (
#         header 'true',
#         inferSchema 'true'
#     )
# """)`
      },
      {
        title: 'Unmanaged table #3: Create with SQL (providing the schema)',
        description: 'Unmanaged table #3: Create either new empty unmanaged table or register existing files (schema must match)',
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
""")

# Create unmanaged Parquet table with SQL
spark.sql("""
    CREATE TABLE IF NOT EXISTS users_external_parquet (
        id INT,
        name STRING,
        age INT
    )
    USING PARQUET
    LOCATION '/mnt/parquet/users_external'
""")

# Create unmanaged CSV table with SQL (with manual schema)
spark.sql("""
    CREATE TABLE IF NOT EXISTS users_external_csv (
        id INT,
        name STRING,
        age INT
    )
    USING CSV
    OPTIONS (header 'true')
    LOCATION '/mnt/csv/users_external'
""")`
      },
      {
        title: 'Unmanaged table #4: SQL CREATE TABLE AS SELECT',
        description: 'Create unmanaged table from existing table or view',
        body: `external_path_4 = "/mnt/delta/unmanaged_users_4"

# create a temporary view from existing DataFrame
df.createOrReplaceTempView("temp_data")

# Now create unmanaged delta table from the temp view data
# table is registered in metastore but data is stored at external location
spark.sql(f"""
    CREATE TABLE IF NOT EXISTS unmanaged_users_4
    USING DELTA LOCATION '{external_path_4}'
    AS SELECT * FROM temp_data
""")

# Create unmanaged Parquet table from temp view
external_path_4_parquet = "/mnt/parquet/unmanaged_users_4"
spark.sql(f"""
    CREATE TABLE IF NOT EXISTS unmanaged_users_4_parquet
    USING PARQUET LOCATION '{external_path_4_parquet}'
    AS SELECT * FROM temp_data
""")

# Create unmanaged CSV table from temp view (schema comes from SELECT)
external_path_4_csv = "/mnt/csv/unmanaged_users_4"
spark.sql(f"""
    CREATE TABLE IF NOT EXISTS unmanaged_users_4_csv
    USING CSV LOCATION '{external_path_4_csv}'
    OPTIONS (header 'true')
    AS SELECT * FROM temp_data
""")`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Python,
    header: 'How to read Delta, Parquet, and CSV files or tables into DataFrames',
    categories: [Category.PySpark, Category.Databricks],
    description: 'Read tables via metastore or directly from file paths.',
    sections: [
      {
        title: 'Read Delta tables via metastore',
        description: 'Works for both managed and unmanaged registered tables.',
        body: `from pyspark.sql import SparkSession, DataFrame

spark = SparkSession.builder.appName("ReadTables").getOrCreate()

# Read Delta table (works for both managed and unmanaged tables)
users: DataFrame = spark.table("managed_users")
users.show()`
      },
      {
        title: 'Read Delta files directly from path',
        description: 'No metastore needed - read directly from file location.',
        body: `from pyspark.sql import DataFrame

# Read Delta table from S3 path
delta_path = "s3://my-bucket/delta/users"
users_df: DataFrame = spark.read.format("delta").load(delta_path)
users_df.show()

# Note: Unlike Parquet, Delta doesn't have a shorthand method like .delta()
# Delta Lake is a library on top of Spark, not a native format`
      },
      {
        title: 'Read Parquet tables via metastore',
        body: `# Read Parquet table (works for both managed and unmanaged tables)
parquet_df: DataFrame = spark.table("managed_users_parquet")
parquet_df.show()`
      },
      {
        title: 'Read Parquet files directly from path',
        body: `# Read Parquet from S3 path
parquet_path = "s3://my-bucket/parquet/users"
parquet_df: DataFrame = spark.read.format("parquet").load(parquet_path)
parquet_df.show()

# Alternative shorter syntax
parquet_df_alt: DataFrame = spark.read.parquet(parquet_path)
parquet_df_alt.show()`
      },
      {
        title: 'Read CSV tables via metastore',
        body: `# Read CSV table (works for both managed and unmanaged tables)
csv_df: DataFrame = spark.table("managed_users_csv")
csv_df.show()`
      },
      {
        title: 'Read CSV files directly from path (with manual schema)',
        description: 'Recommended approach: define schema explicitly for reliability and performance.',
        body: `from pyspark.sql.types import StructType, StructField, StringType, IntegerType

# Define schema
csv_schema = StructType([
    StructField("id", IntegerType(), nullable=False),
    StructField("name", StringType(), nullable=False),
    StructField("age", IntegerType(), nullable=False)
])

# Read CSV with manual schema
csv_path = "s3://my-bucket/csv/users"
csv_df: DataFrame = spark.read.format("csv") \\
    .option("header", "true") \\
    .schema(csv_schema) \\
    .load(csv_path)

csv_df.show()
csv_df.printSchema()

# Alternative shorter syntax
csv_df_alt: DataFrame = spark.read.csv(csv_path, header=True, schema=csv_schema)
csv_df_alt.show()`
      },
      {
        title: 'Read CSV files directly from path (with inferSchema)',
        description: 'Alternative approach: let Spark infer types (slower, not recommended for production).',
        body: `# Read CSV with inferSchema
csv_path = "s3://my-bucket/csv/users"
csv_df_inferred: DataFrame = spark.read.format("csv") \\
    .option("header", "true") \\
    .option("inferSchema", "true") \\
    .load(csv_path)

csv_df_inferred.show()
csv_df_inferred.printSchema()

# Alternative shorter syntax
csv_df_inferred_alt: DataFrame = spark.read.csv(csv_path, header=True, inferSchema=True)
csv_df_inferred_alt.show()

# Note: inferSchema requires scanning the data, which:
# - Increases read time
# - May infer incorrect types
# - Not deterministic if data changes`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Python,
    header: 'How to write DataFrames to Delta, Parquet, and CSV files on S3',
    categories: [Category.PySpark, Category.Databricks],
    description: 'Write DataFrames directly to file storage without creating tables.',
    sections: [
      {
        title: 'Create sample DataFrame',
        body: `from pyspark.sql import SparkSession, DataFrame

spark = SparkSession.builder.appName("WriteFiles").getOrCreate()

# Sample data
data = [(1, "Alice", 25), (2, "Bob", 30), (3, "Charlie", 35)]
columns = ["id", "name", "age"]
df: DataFrame = spark.createDataFrame(data, columns)

df.show()`
      },
      {
        title: 'Write Delta files to S3',
        body: `# Write DataFrame as Delta files
delta_path = "s3://my-bucket/delta/users"
df.write.format("delta").mode("overwrite").save(delta_path)

# Write modes:
# - overwrite: Replace all data
# - append: Add to existing data
# - ignore: Do nothing if data exists
# - error/errorifexists: Throw error if data exists (default)

# Append new data
new_data = [(4, "Diana", 28)]
new_df = spark.createDataFrame(new_data, columns)
new_df.write.format("delta").mode("append").save(delta_path)`
      },
      {
        title: 'Write Parquet files to S3',
        body: `# Write DataFrame as Parquet files
parquet_path = "s3://my-bucket/parquet/users"
df.write.format("parquet").mode("overwrite").save(parquet_path)

# Alternative shorter syntax
df.write.parquet(parquet_path, mode="overwrite")

# With compression
df.write.format("parquet") \\
    .mode("overwrite") \\
    .option("compression", "snappy") \\
    .save(parquet_path)

# Compression options: snappy (default), gzip, lzo, brotli, lz4, zstd`
      },
      {
        title: 'Write CSV files to S3',
        body: `# Write DataFrame as CSV files
csv_path = "s3://my-bucket/csv/users"
df.write.format("csv") \\
    .mode("overwrite") \\
    .option("header", "true") \\
    .save(csv_path)

# Alternative shorter syntax
df.write.csv(csv_path, mode="overwrite", header=True)

# With additional options
df.write.format("csv") \\
    .mode("overwrite") \\
    .option("header", "true") \\
    .option("delimiter", ",") \\
    .option("quote", "\\"") \\
    .option("escape", "\\\\") \\
    .option("compression", "gzip") \\
    .save(csv_path)`
      },
      {
        title: 'Control number of output files',
        description: 'Manage file partitioning for performance optimization.',
        body: `# Write to specific number of files
df.repartition(5).write.format("parquet") \\
    .mode("overwrite") \\
    .save("s3://my-bucket/parquet/users_5_files")

# Write to single file (not recommended for large datasets)
df.coalesce(1).write.format("parquet") \\
    .mode("overwrite") \\
    .save("s3://my-bucket/parquet/users_single")

# Note: 
# - repartition(): Full shuffle, distributes evenly
# - coalesce(): No shuffle, combines partitions (faster but may be uneven)`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Python,
    header: 'How to partition data (and why dynamic partitioning is important)',
    categories: [Category.PySpark, Category.Databricks],
    description: 'Partition data for better query performance and learn the critical difference between static and dynamic partition overwrite modes.',
    sections: [
      {
        title: 'Why partition data?',
        description: 'Understanding the benefits of partitioning.',
        body: `# Partitioning organizes data into subdirectories based on column values
# Benefits:
# 1. Query performance: Skip reading irrelevant data (partition pruning)
# 2. Data management: Easier to delete/update specific subsets
# 3. Parallel processing: Better parallelization

# Example directory structure with partitioning:
# s3://bucket/data/
#   age=25/
#     part-00000.parquet
#   age=30/
#     part-00000.parquet
#   age=35/
#     part-00000.parquet

# Query with WHERE age = 30 only reads the age=30/ directory
# Without partitioning: reads all files and filters in memory (slower)`
      },
      {
        title: 'Partition files with .save()',
        body: `from pyspark.sql import SparkSession, DataFrame

spark = SparkSession.builder.appName("Partitioning").getOrCreate()

# Sample data
data = [(1, "Alice", 25), (2, "Bob", 30), (3, "Charlie", 35), (4, "Diana", 30)]
columns = ["id", "name", "age"]
df = spark.createDataFrame(data, columns)

# Partition by single column
df.write.format("parquet") \\
    .mode("overwrite") \\
    .partitionBy("age") \\
    .save("s3://my-bucket/parquet/users_by_age")

# Partition by multiple columns (creates nested structure)
df.write.format("delta") \\
    .mode("overwrite") \\
    .partitionBy("age", "name") \\
    .save("s3://my-bucket/delta/users_by_age_name")

# Creates: s3://bucket/delta/users_by_age_name/age=25/name=Alice/

# Partitioning also works with CSV
df.write.format("csv") \\
    .mode("overwrite") \\
    .option("header", "true") \\
    .partitionBy("age") \\
    .save("s3://my-bucket/csv/users_by_age")

# Note: CSV doesn't store schema, so when reading partitioned CSVs,
# you still need to provide schema or use inferSchema`,
        output: `# Directory structure created:
# s3://my-bucket/parquet/users_by_age/
#   age=25/
#     part-00000-xxx.parquet
#   age=30/
#     part-00000-xxx.parquet
#     part-00001-xxx.parquet  <- Multiple files if data is large
#   age=35/
#     part-00000-xxx.parquet
#
# s3://my-bucket/delta/users_by_age_name/
#   age=25/
#     name=Alice/
#       part-00000-xxx.parquet
#   age=30/
#     name=Bob/
#       part-00000-xxx.parquet
#     name=Diana/
#       part-00000-xxx.parquet
#   age=35/
#     name=Charlie/
#       part-00000-xxx.parquet`
      },
      {
        title: 'Partition tables with .saveAsTable()',
        body: `# Create partitioned managed table
df.write.format("delta") \\
    .mode("overwrite") \\
    .partitionBy("age") \\
    .saveAsTable("users_partitioned")

# Create partitioned unmanaged table
df.write.format("parquet") \\
    .mode("overwrite") \\
    .option("path", "s3://my-bucket/parquet/users_external") \\
    .partitionBy("age") \\
    .saveAsTable("users_external_partitioned")

# CSV tables can be partitioned too
df.write.format("csv") \\
    .mode("overwrite") \\
    .option("header", "true") \\
    .partitionBy("age") \\
    .saveAsTable("users_csv_partitioned")`
      },
      {
        title: 'Static partition overwrite (default behavior - DANGEROUS!)',
        description: 'Default mode deletes ALL partitions, even those not in the DataFrame.',
        body: `# Initial data: age=25, age=30, age=35 partitions exist
df.write.format("delta") \\
    .mode("overwrite") \\
    .partitionBy("age") \\
    .save("s3://my-bucket/delta/users")

# Later: Update only age=30 data
age_30_data = [(5, "Eve", 30), (6, "Frank", 30)]
age_30_df = spark.createDataFrame(age_30_data, columns)

# DANGER: Static mode (default) deletes ALL partitions!
age_30_df.write.format("delta") \\
    .mode("overwrite") \\
    .partitionBy("age") \\
    .save("s3://my-bucket/delta/users")

# Result: Only age=30 partition exists now!
# age=25 and age=35 partitions were DELETED even though not in DataFrame
# This is almost never what you want in production!`,
        output: `# Before overwrite - 3 partitions exist:
# s3://my-bucket/delta/users/
#   age=25/ (Alice)
#   age=30/ (Bob, Diana)
#   age=35/ (Charlie)

# After static overwrite with only age=30 data:
# s3://my-bucket/delta/users/
#   age=30/  <- Only this partition remains!`
      },
      {
        title: 'Dynamic partition overwrite (recommended for production)',
        description: 'Only overwrites partitions present in the DataFrame, keeps others intact.',
        body: `# Initial data: age=25, age=30, age=35 partitions exist
df.write.format("delta") \\
    .mode("overwrite") \\
    .partitionBy("age") \\
    .save("s3://my-bucket/delta/users")

# Later: Update only age=30 data with dynamic mode
age_30_data = [(5, "Eve", 30), (6, "Frank", 30)]
age_30_df = spark.createDataFrame(age_30_data, columns)

age_30_df.write.format("delta") \\
    .mode("overwrite") \\
    [[MARK]].option("partitionOverwriteMode", "dynamic")[[/MARK]] \\
    .partitionBy("age") \\
    .save("s3://my-bucket/delta/users")

# Result: Only age=30 partition is overwritten
# age=25 and age=35 partitions remain unchanged
# This is the safe, correct behavior for incremental updates!`,
        output: `# Before overwrite - 3 partitions exist:
# s3://my-bucket/delta/users/
#   age=25/ (Alice)
#   age=30/ (Bob, Diana)
#   age=35/ (Charlie)

# After dynamic overwrite with only age=30 data:
# s3://my-bucket/delta/users/
#   age=25/  <- Still here! (Alice)
#   age=30/  <- Only this one updated (Eve, Frank)
#   age=35/  <- Still here! (Charlie)

# SUCCESS: Only age=30 refreshed, other partitions preserved!`
      },
      {
        title: 'Dynamic partition overwrite with tables',
        body: `# Create partitioned table
df.write.format("delta") \\
    .mode("overwrite") \\
    .partitionBy("age") \\
    .saveAsTable("users_partitioned")

# Update specific partitions with dynamic mode
age_30_df = df.filter("age = 30")
age_30_df.write.format("delta") \\
    .mode("overwrite") \\
    [[MARK]].option("partitionOverwriteMode", "dynamic")[[/MARK]] \\
    .partitionBy("age") \\
    .saveAsTable("users_partitioned")

# Works with Parquet and CSV too
age_30_df.write.format("parquet") \\
    .mode("overwrite") \\
    [[MARK]].option("partitionOverwriteMode", "dynamic")[[/MARK]] \\
    .partitionBy("age") \\
    .saveAsTable("users_parquet_partitioned")`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Python,
    header: 'How to create Delta tables from YAML configuration',
    categories: [Category.PySpark, Category.Databricks],
    description: 'Define table schemas in YAML and automatically create Delta tables from the configuration.',
    sections: [
      {
        title: 'YAML Configuration',
        codeLabel: 'tables_config.yaml',
        hljsLanguage: 'yaml',
        body: `tables:
  - name: employees
    location: s3://my-bucket/delta/employees
    columns:
      - name: employee_id
        type: INT
        nullable: false
      - name: first_name
        type: STRING
        nullable: false
      - name: last_name
        type: STRING
        nullable: false
      - name: email
        type: STRING
        nullable: true
      - name: hire_date
        type: DATE
        nullable: false
      - name: salary
        type: DOUBLE
        nullable: true
  
  - name: departments
    location: s3://my-bucket/delta/departments
    columns:
      - name: department_id
        type: INT
        nullable: false
      - name: department_name
        type: STRING
        nullable: false
      - name: manager_id
        type: INT
        nullable: true
      - name: budget
        type: DECIMAL(15,2)
        nullable: true
      - name: created_at
        type: TIMESTAMP
        nullable: false`
      },
      {
        title: 'Python Script to Create Tables',
        body: `import yaml
from pyspark.sql import SparkSession
from pyspark.sql.types import (
    StructType, StructField, StringType, IntegerType, 
    DoubleType, DateType, TimestampType, DecimalType
)

spark = SparkSession.builder.appName("DeltaFromYAML").getOrCreate()

# Type mapping from YAML string to PySpark types
TYPE_MAPPING = {
    "INT": IntegerType(),
    "INTEGER": IntegerType(),
    "STRING": StringType(),
    "DOUBLE": DoubleType(),
    "FLOAT": DoubleType(),
    "DATE": DateType(),
    "TIMESTAMP": TimestampType(),
}

def parse_type(type_str: str):
    """Parse type string, handling DECIMAL(p,s) format."""
    if type_str.startswith("DECIMAL"):
        # Extract precision and scale: DECIMAL(15,2)
        parts = type_str.replace("DECIMAL(", "").replace(")", "").split(",")
        precision = int(parts[0])
        scale = int(parts[1]) if len(parts) > 1 else 0
        return DecimalType(precision, scale)
    return TYPE_MAPPING.get(type_str.upper(), StringType())

# Read YAML configuration
with open("tables_config.yaml", "r") as f:
    config = yaml.safe_load(f)

# Create each table from configuration
for table_config in config["tables"]:
    table_name = table_config["name"]
    location = table_config["location"]
    
    # Build schema from columns
    fields = []
    for col in table_config["columns"]:
        field = StructField(
            col["name"],
            parse_type(col["type"]),
            col.get("nullable", True)
        )
        fields.append(field)
    
    schema = StructType(fields)
    
    # Create empty DataFrame with schema
    empty_df = spark.createDataFrame([], schema)
    
    # Write as Delta table
    empty_df.write.format("delta") \
        .mode("overwrite") \
        .option("path", location) \
        .saveAsTable(table_name)
    
    print(f"Created table: {table_name} at {location}")
    print(f"Schema: {schema}\n")`,
        output: `Created table: employees at s3://my-bucket/delta/employees
Schema: StructType([
    StructField('employee_id', IntegerType(), False),
    StructField('first_name', StringType(), False),
    StructField('last_name', StringType(), False),
    StructField('email', StringType(), True),
    StructField('hire_date', DateType(), False),
    StructField('salary', DoubleType(), True)
])

Created table: departments at s3://my-bucket/delta/departments
Schema: StructType([
    StructField('department_id', IntegerType(), False),
    StructField('department_name', StringType(), False),
    StructField('manager_id', IntegerType(), True),
    StructField('budget', DecimalType(15,2), True),
    StructField('created_at', TimestampType(), False)
])`
      },
      {
        title: 'Alternative: Using SQL CREATE TABLE',
        description: 'Generate and execute SQL CREATE TABLE statements from YAML.',
        body: `import yaml
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("DeltaFromYAML").getOrCreate()

# Read YAML configuration
with open("tables_config.yaml", "r") as f:
    config = yaml.safe_load(f)

# Create each table using SQL
for table_config in config["tables"]:
    table_name = table_config["name"]
    location = table_config["location"]
    
    # Build column definitions
    col_defs = []
    for col in table_config["columns"]:
        nullable = "" if col.get("nullable", True) else "NOT NULL"
        col_def = f"{col['name']} {col['type']} {nullable}".strip()
        col_defs.append(col_def)
    
    columns_sql = ",\n        ".join(col_defs)
    
    # Generate CREATE TABLE SQL
    create_sql = f"""
    CREATE TABLE IF NOT EXISTS {table_name} (
        {columns_sql}
    )
    USING DELTA
    LOCATION '{location}'
    """
    
    # Execute SQL
    spark.sql(create_sql)
    print(f"Created table: {table_name}")
    print(f"SQL: {create_sql}\n")`,
        output: `Created table: employees
SQL: 
    CREATE TABLE IF NOT EXISTS employees (
        employee_id INT NOT NULL,
        first_name STRING NOT NULL,
        last_name STRING NOT NULL,
        email STRING,
        hire_date DATE NOT NULL,
        salary DOUBLE
    )
    USING DELTA
    LOCATION 's3://my-bucket/delta/employees'
    
Created table: departments
SQL: 
    CREATE TABLE IF NOT EXISTS departments (
        department_id INT NOT NULL,
        department_name STRING NOT NULL,
        manager_id INT,
        budget DECIMAL(15,2),
        created_at TIMESTAMP NOT NULL
    )
    USING DELTA
    LOCATION 's3://my-bucket/delta/departments'`
      },
      {
        title: 'Verify Created Tables',
        body: `# List tables
spark.sql("SHOW TABLES").show()

# Describe table schemas
spark.sql("DESCRIBE EXTENDED employees").show(truncate=False)
spark.sql("DESCRIBE EXTENDED departments").show(truncate=False)`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Python,
    header: 'How to update Delta Table records',
    categories: [Category.PySpark, Category.Databricks],
    description: 'ONLY DELTA format supports UPDATES, DELETES & MERGES! While parquet and CSV are immutable formats, Delta Lake provides ACID transactions and allows record-level updates via its transaction log. ',
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
        description: 'Update records using standard SQL UPDATE syntax. Anything other than DELTA will error out!',
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
        description: 'Alternative to DeltaTable API - uses SQL MERGE syntax for upsert. Anything other than DELTA will error out!',
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
