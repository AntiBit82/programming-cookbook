import { CodeExample, ProgrammingLanguage, Category } from '../models/code-example.model';

export const JAVA_EXAMPLES: CodeExample[] = [
  {
    language: ProgrammingLanguage.Java,
    header: 'How to use lambda functions',
    categories: [Category.Basic],
    sections: [
      {
        title: 'Lambda expression for filtering',
        codeLabel: 'Lambda Example Code',
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
    language: ProgrammingLanguage.Java,
    header: 'How to use ExecutorService with multiple threads',
    categories: [Category.Multithreading],
    description: 'Using ExecutorService to execute tasks concurrently. Results are processed in the order tasks complete, requiring manual tracking.',
    sections: [
      {
        title: 'ExecutorService with 4 threads',
        body: `import java.util.concurrent.*;
import java.util.*;

public class ExecutorServiceExample {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        ExecutorService executor = Executors.newFixedThreadPool(4);
        List<Future<String>> futures = new ArrayList<>();
        
        // Submit 10 tasks
        for (int i = 1; i <= 10; i++) {
            final int taskId = i;
            Future<String> future = executor.submit(() -> {
                // Simulate work with varying duration
                Thread.sleep((11 - taskId) * 100);
                return "Task " + taskId + " completed";
            });
            futures.add(future);
        }
        
        // Must wait for each future in submission order
        for (Future<String> future : futures) {
            String result = future.get(); // Blocks until this specific task completes
            System.out.println(result);
        }
        
        // awaitTermination() not needed - all tasks already completed via get()
        executor.shutdown();
    }
}`,
        output: `Task 1 completed
Task 2 completed
Task 3 completed
Task 4 completed
Task 5 completed
Task 6 completed
Task 7 completed
Task 8 completed
Task 9 completed
Task 10 completed`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Java,
    header: 'How to use ExecutorCompletionService for efficient result processing',
    categories: [Category.Multithreading],
    description: 'ExecutorCompletionService allows processing results as soon as any task completes, rather than waiting for tasks in submission order.',
    sections: [
      {
        title: 'ExecutorCompletionService with 4 threads',
        body: `import java.util.concurrent.*;

public class CompletionServiceExample {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        ExecutorService executor = Executors.newFixedThreadPool(4);
        ExecutorCompletionService<String> completionService = 
            new ExecutorCompletionService<>(executor);
        
        // Submit 10 tasks
        for (int i = 1; i <= 10; i++) {
            final int taskId = i;
            completionService.submit(() -> {
                // Simulate work with varying duration
                Thread.sleep((11 - taskId) * 100);
                return "Task " + taskId + " completed";
            });
        }
        
        // Process results as they complete (not in submission order)
        for (int i = 0; i < 10; i++) {
            Future<String> future = completionService.take(); // Blocks until ANY task completes
            String result = future.get();
            System.out.println(result);
        }
        
        // awaitTermination() not needed - all tasks already completed via take()
        executor.shutdown();
    }
}`,
        output: `Task 10 completed
Task 9 completed
Task 8 completed
Task 7 completed
Task 6 completed
Task 5 completed
Task 4 completed
Task 3 completed
Task 2 completed
Task 1 completed`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Java,
    header: 'How and when to use ExecutorService awaitTermination() with fire-and-forget tasks',
    categories: [Category.Multithreading],
    description: 'When tasks perform side effects without returning values (execute() instead of submit()), awaitTermination() ensures all tasks complete before shutdown.',
    sections: [
      {
        title: 'Fire-and-forget tasks with awaitTermination()',
        body: `import java.util.concurrent.*;

public class AwaitTerminationExample {
    
    private static void logToDb(int id) {
        try {
            Thread.sleep(1000); // Simulate database write
            System.out.println("Entry " + id + " saved to DB");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    public static void main(String[] args) throws InterruptedException {
        ExecutorService executor = Executors.newFixedThreadPool(10);
        
        // Submit 1000 fire-and-forget tasks (no Future needed)
        for (int i = 1; i <= 1000; i++) {
            final int entryId = i;
            executor.execute(() -> logToDb(entryId));
        }
        
        // Signal no more tasks will be submitted
        executor.shutdown();
        System.out.println("Executor is shut down. No more tasks!");
        
        // Wait for all tasks to complete (crucial for fire-and-forget)
        // Without this, program exits before all DB writes finish
        executor.awaitTermination(Integer.MAX_VALUE, TimeUnit.SECONDS);
        
        System.out.println("All 1000 entries logged to database");
    }
}`,
        output: `Executor is shut down. No more tasks!
Entry 1 saved to DB
Entry 2 saved to DB
Entry 3 saved to DB
...
Entry 998 saved to DB
Entry 999 saved to DB
Entry 1000 saved to DB
All 1000 entries logged to database`
      }
    ]
  }
];
