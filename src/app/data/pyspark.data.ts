import { CodeExample, ProgrammingLanguage, Category } from '../models/code-example.model';

export const PYSPARK_EXAMPLES: CodeExample[] = [
  {
    language: ProgrammingLanguage.Python,
    header: 'How to read CSV files in PySpark',
    categories: [Category.PySpark],
    sections: [
      {
        title: 'Sample CSV Data Structure',
        codeLabel: 'sample_data.csv',
        body: `name,age,salary
Alice,28,75000.50
Bob,35,92000.75
Charlie,42,105000.00
Diana,31,88500.25`,
      },
      {
        title: 'Simple CSV Read from S3',
        body: `from pyspark.sql import SparkSession

# Initialize Spark session
spark = SparkSession.builder \\
    .appName("CSV Reader") \\
    .getOrCreate()

# Read CSV from S3 with default settings
df = spark.read.csv(
    "s3a://my-bucket/path/to/sample_data.csv",
    header=True
)

df.show()
df.printSchema()`,
        output: `+-------+---+--------+
|   name|age|  salary|
+-------+---+--------+
|  Alice| 28|75000.50|
|    Bob| 35|92000.75|
|Charlie| 42|105000.0|
|  Diana| 31|88500.25|
+-------+---+--------+

root
 |-- name: string (nullable = true)
 |-- age: string (nullable = true)
 |-- salary: string (nullable = true)`
      },
      {
        title: 'Read CSV with Infer Schema',
        body: `from pyspark.sql import SparkSession

spark = SparkSession.builder \\
    .appName("CSV Reader with Infer Schema") \\
    .getOrCreate()

# Read CSV with schema inference
df = spark.read.csv(
    "s3a://my-bucket/path/to/sample_data.csv",
    header=True,
    inferSchema=True
)

# Display DataFrame with inferred types
df.show()
df.printSchema()`,
        output: `+-------+---+---------+
|   name|age|   salary|
+-------+---+---------+
|  Alice| 28| 75000.50|
|    Bob| 35| 92000.75|
|Charlie| 42|105000.00|
|  Diana| 31| 88500.25|
+-------+---+---------+

root
 |-- name: string (nullable = true)
 |-- age: integer (nullable = true)
 |-- salary: double (nullable = true)`
      },
      {
        title: 'Read CSV with Manual Schema Definition',
        body: `from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, DoubleType

spark = SparkSession.builder \\
    .appName("CSV Reader with Schema") \\
    .getOrCreate()

# Define schema manually
schema = StructType([
    StructField("name", StringType(), nullable=False),
    StructField("age", IntegerType(), nullable=False),
    StructField("salary", DoubleType(), nullable=False)
])

# Read CSV with predefined schema
df = spark.read.csv(
    "s3a://my-bucket/path/to/sample_data.csv",
    header=True,
    schema=schema
)

# Display DataFrame with explicit types
df.show()
df.printSchema()`,
        output: `+-------+---+---------+
|   name|age|   salary|
+-------+---+---------+
|  Alice| 28| 75000.50|
|    Bob| 35| 92000.75|
|Charlie| 42|105000.00|
|  Diana| 31| 88500.25|
+-------+---+---------+

root
 |-- name: string (nullable = false)
 |-- age: integer (nullable = false)
 |-- salary: double (nullable = false)`
      },
      {
        title: 'Read CSV with Additional Options',
        body: `from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, DoubleType

spark = SparkSession.builder \\
    .appName("CSV Reader with Options") \\
    .getOrCreate()

schema = StructType([
    StructField("name", StringType(), nullable=False),
    StructField("age", IntegerType(), nullable=False),
    StructField("salary", DoubleType(), nullable=False)
])

# Read CSV with multiple options
# mode options: PERMISSIVE (default, sets nulls), DROPMALFORMED (drops bad rows), FAILFAST (throws exception)
df = spark.read \\
    .option("header", "true") \\
    .option("delimiter", ",") \\
    .option("mode", "DROPMALFORMED") \\
    .option("nullValue", "NULL") \\
    .schema(schema) \\
    .csv("s3a://my-bucket/path/to/sample_data.csv")

df.show()

# Alternative: using format() & load() method
df_alt = spark.read \\
    .format("csv") \\
    .option("header", "true") \\
    .option("inferSchema", "true") \\
    .load("s3a://my-bucket/path/to/sample_data.csv")

df_alt.show()`,
        output: `+-------+---+---------+
|   name|age|   salary|
+-------+---+---------+
|  Alice| 28| 75000.50|
|    Bob| 35| 92000.75|
|Charlie| 42|105000.00|
|  Diana| 31| 88500.25|
+-------+---+---------+

+-------+---+---------+
|   name|age|   salary|
+-------+---+---------+
|  Alice| 28| 75000.50|
|    Bob| 35| 92000.75|
|Charlie| 42|105000.00|
|  Diana| 31| 88500.25|
+-------+---+---------+`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Python,
    header: 'How to read Parquet files in PySpark',
    categories: [Category.PySpark],
    sections: [
      {
        title: 'Simple Parquet Read from S3',
        body: `from pyspark.sql import SparkSession

spark = SparkSession.builder \\
    .appName("Parquet Reader") \\
    .getOrCreate()

# Read Parquet file from S3
df = spark.read.parquet("s3a://my-bucket/path/to/data.parquet")

df.show()
df.printSchema()`,
        output: `+-------+---+---------+
|   name|age|   salary|
+-------+---+---------+
|  Alice| 28| 75000.50|
|    Bob| 35| 92000.75|
|Charlie| 42|105000.00|
|  Diana| 31| 88500.25|
+-------+---+---------+

root
 |-- name: string (nullable = true)
 |-- age: integer (nullable = true)
 |-- salary: double (nullable = true)`
      },
      {
        title: 'Read Multiple Parquet Files',
        body: `from pyspark.sql import SparkSession

spark = SparkSession.builder \\
    .appName("Multiple Parquet Reader") \\
    .getOrCreate()

# Read all parquet files in a directory
df = spark.read.parquet("s3a://my-bucket/path/to/parquet_dir/")

# Read multiple specific files
df_multi = spark.read.parquet(
    "s3a://my-bucket/path/to/file1.parquet",
    "s3a://my-bucket/path/to/file2.parquet"
)

# Read with wildcard pattern
df_wildcard = spark.read.parquet("s3a://my-bucket/path/to/*.parquet")

df.show()`,
        output: `+-------+---+---------+
|   name|age|   salary|
+-------+---+---------+
|  Alice| 28| 75000.50|
|    Bob| 35| 92000.75|
|Charlie| 42|105000.00|
|  Diana| 31| 88500.25|
+-------+---+---------+`
      },
      {
        title: 'Read Parquet with Options',
        body: `from pyspark.sql import SparkSession

spark = SparkSession.builder \\
    .appName("Parquet Options") \\
    .getOrCreate()

# Read with merge schema option (useful when schema evolves)
df = spark.read \\
    .option("mergeSchema", "true") \\
    .parquet("s3a://my-bucket/path/to/data.parquet")

# Read with compression codec specification
df_compressed = spark.read \\
    .option("compression", "snappy") \\
    .parquet("s3a://my-bucket/path/to/data.parquet")

# Alternative: using format() method
df_alt = spark.read \\
    .format("parquet") \\
    .load("s3a://my-bucket/path/to/data.parquet")

df.show()`,
        output: `+-------+---+---------+
|   name|age|   salary|
+-------+---+---------+
|  Alice| 28| 75000.50|
|    Bob| 35| 92000.75|
|Charlie| 42|105000.00|
|  Diana| 31| 88500.25|
+-------+---+---------+`
      },
      {
        title: 'Read Partitioned Parquet Files',
        body: `from pyspark.sql import SparkSession

spark = SparkSession.builder \\
    .appName("Partitioned Parquet Reader") \\
    .getOrCreate()

# Directory structure:
# s3a://my-bucket/data/
#   year=2024/
#     month=01/
#       part-00000.parquet
#     month=02/
#       part-00000.parquet

# Read partitioned data (automatic partition discovery)
df = spark.read.parquet("s3a://my-bucket/data/")

df.show()
df.printSchema()`,
        output: `+-------+---+---------+----+-----+
|   name|age|   salary|year|month|
+-------+---+---------+----+-----+
|  Alice| 28| 75000.50|2024|   01|
|    Bob| 35| 92000.75|2024|   01|
|Charlie| 42|105000.00|2024|   02|
|  Diana| 31| 88500.25|2024|   02|
+-------+---+---------+----+-----+

root
 |-- name: string (nullable = true)
 |-- age: integer (nullable = true)
 |-- salary: double (nullable = true)
 |-- year: integer (nullable = true)
 |-- month: integer (nullable = true)`
      }
    ]
  }
];
