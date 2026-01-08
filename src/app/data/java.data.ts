import { CodeExample, ProgrammingLanguage, Category } from '../models/code-example.model';

export const JAVA_EXAMPLES: CodeExample[] = [
  {
    language: ProgrammingLanguage.Java,
    header: 'How to create auto generated ids',
    categories: [Category.Hibernate],
    description: 'Different strategies for generating primary keys automatically in Hibernate/JPA.',
    sections: [
      {
        title: 'AUTO - Database decides strategy',
        codeLabel: 'Java Entity',
        hljsLanguage: 'java',
        body: `import javax.persistence.*;

@Entity
public class Product {
    [[MARK]]@Id
    @GeneratedValue(strategy = GenerationType.AUTO)[[/MARK]]
    private Long id;
}

// AUTO is the default - these are equivalent:
@Entity
public class Item {
    [[MARK]]@Id
    @GeneratedValue  // No strategy = AUTO[[/MARK]]
    private Long id;
}

// Or with UUID
@Entity
public class Order {
    @Id
    @GeneratedValue
    private UUID id;
}`,
        output: `// Hibernate picks the strategy based on database
// PostgreSQL/Oracle: Creates default sequence (hibernate_sequence)
// MySQL 8+: Uses IDENTITY (auto-increment)
// Older MySQL: Uses TABLE strategy

Product ID: 1
Product ID: 2
Product ID: 3

Order UUID: 550e8400-e29b-41d4-a716-446655440000
Order UUID: 6ba7b810-9dad-11d1-80b4-00c04fd430c8

// Most portable but less control over sequence name/settings`
      },
      {
        title: 'IDENTITY - Database auto-increment',
        codeLabel: 'Java Entity',
        hljsLanguage: 'java',
        body: `import javax.persistence.*;

@Entity
public class User {
    [[MARK]]@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)[[/MARK]]
    private Long id;
}`,
        output: `// Uses database auto-increment (AUTO_INCREMENT in MySQL, SERIAL in PostgreSQL)
// ID generated ONLY after INSERT
User ID: 1
User ID: 2
User ID: 3

// Cannot batch inserts: Each INSERT must execute immediately to get the ID back
// INSERT INTO user VALUES (...);  -- must execute now
// INSERT INTO user VALUES (...);  -- must execute now
// INSERT INTO user VALUES (...);  -- must execute now

// Why use it? Simplicity + works everywhere
// For low-volume inserts (<1000/sec), batching doesn't matter
// MySQL's default and most straightforward approach`
      },
      {
        title: 'SEQUENCE - Database sequence',
        codeLabel: 'Java Entity',
        hljsLanguage: 'java',
        body: `import javax.persistence.*;

@Entity
public class Customer {
    [[MARK]]@Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customer_seq")
    @SequenceGenerator(name = "customer_seq", sequenceName = "customer_sequence", allocationSize = 50)[[/MARK]]
    private Long id;
}`,
        output: `// Uses database sequence (Oracle, PostgreSQL)
// ID generated BEFORE INSERT - better performance
Customer ID: 1
Customer ID: 2
Customer ID: 3

// Hibernate creates the sequence if it doesn't exist (with hbm2ddl.auto=create/update)
// SQL: CREATE SEQUENCE customer_sequence START WITH 1 INCREMENT BY 50

// Can batch inserts
// allocationSize=50: fetches sequence once, generates 50 IDs in memory (1-50)
// Next batch: fetches again, generates next 50 IDs (51-100)
// Reduces database calls by 50x`
      },
      {
        title: 'TABLE - ID generator table',
        codeLabel: 'Java Entity',
        hljsLanguage: 'java',
        body: `import javax.persistence.*;

@Entity
public class Invoice {
    [[MARK]]@Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "invoice_gen")
    @TableGenerator(
        name = "invoice_gen",
        table = "id_generator",
        pkColumnName = "gen_name",
        valueColumnName = "gen_value",
        pkColumnValue = "invoice_id",
        allocationSize = 1
    )[[/MARK]]
    private Long id;
}`,
        output: `// Uses separate table to track IDs
// Table structure:
// | gen_name   | gen_value |
// | invoice_id | 3         |

Invoice ID: 1
Invoice ID: 2
Invoice ID: 3

// Portable across all databases but slower (requires separate table access)
// Good for databases without sequence support`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Java,
    header: 'How to define entity relationships (1:1, 1:N, N:M)',
    categories: [Category.Hibernate],
    description: 'Different types of relationships between entities in Hibernate/JPA with bidirectional mappings.',
    sections: [
      {
        title: 'One-to-One (1:1) - User and Profile',
        codeLabel: 'Java Entities',
        hljsLanguage: 'java',
        body: `import javax.persistence.*;

@Entity
public class User {
    @Id
    @GeneratedValue
    private Long id;
    
    // Inverse side (mappedBy)
    // Cascade ALL: saving User saves Profile, deleting User deletes Profile
    // Cascade can be specified on either side/entity
    [[MARK]]@OneToOne(mappedBy = "user", cascade = CascadeType.ALL)[[/MARK]]
    private Profile profile;
    
    public Profile getProfile() {
        return profile;
    }
    
    public void setProfile(Profile profile) {
        this.profile = profile;
        if (profile != null && profile.getUser() != this) {
            profile.setUser(this);
        }
    }
    
    public void removeProfile() {
        if (profile != null) {
            profile.setUser(null);
            this.profile = null;
        }
    }
}

@Entity
public class Profile {
    @Id
    @GeneratedValue
    private Long id;
    
    // Owning side (has JoinColumn)
    [[MARK]]@OneToOne
    @JoinColumn(name = "user_id")[[/MARK]]
    private User user;
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
        if (user != null && user.getProfile() != this) {
            user.setProfile(this);
        }
    }
    
    public void removeUser() {
        if (user != null) {
            user.setProfile(null);
            this.user = null;
        }
    }
}`,
        output: `// Database structure:
// USER table: id
// PROFILE table: id, user_id (FK)

// One User has exactly one Profile
// One Profile belongs to exactly one User

User user = new User();
Profile profile = new Profile();
profile.setUser(user);  // Sets both sides of relationship

// Saves both entities (cascade)
session.save(user);`
      },
      {
        title: 'One-to-Many (1:N) - Department and Employees',
        codeLabel: 'Java Entities',
        hljsLanguage: 'java',
        body: `import javax.persistence.*;
import java.util.*;

@Entity
public class Department {
    @Id
    @GeneratedValue
    private Long id;
    
    // Inverse side (mappedBy)
    // Cascade ALL: saving Department saves Employees, deleting Department deletes Employees
    [[MARK]]@OneToMany(mappedBy = "department", cascade = CascadeType.ALL)[[/MARK]]
    private List<Employee> employees = new ArrayList<>();
    
    public List<Employee> getEmployees() {
        return employees;
    }
    
    public void addEmployee(Employee employee) {
        employees.add(employee);
        if (employee.getDepartment() != this) {
            employee.setDepartment(this);
        }
    }
    
    public void removeEmployee(Employee employee) {
        employees.remove(employee);
        employee.setDepartment(null);
    }
}

@Entity
public class Employee {
    @Id
    @GeneratedValue
    private Long id;
    
    // Owning side (has JoinColumn)
    [[MARK]]@ManyToOne
    @JoinColumn(name = "department_id")[[/MARK]]
    private Department department;
    
    public Department getDepartment() {
        return department;
    }
    
    public void setDepartment(Department department) {
        this.department = department;
        if (department != null && !department.getEmployees().contains(this)) {
            department.getEmployees().add(this);
        }
    }
    
    public void removeDepartment() {
        if (department != null) {
            department.getEmployees().remove(this);
            this.department = null;
        }
    }
}`,
        output: `// Database structure:
// DEPARTMENT table: id
// EMPLOYEE table: id, department_id (FK)

// One Department has many Employees
// Many Employees belong to one Department

Department dept = new Department();
Employee emp1 = new Employee();
Employee emp2 = new Employee();

dept.addEmployee(emp1);  // Sets both sides of relationship
dept.addEmployee(emp2);

// Saves all entities (cascade)
session.save(dept);`
      },
      {
        title: 'Many-to-Many (N:M) - Student and Course',
        codeLabel: 'Java Entities',
        hljsLanguage: 'java',
        body: `import javax.persistence.*;
import java.util.*;

@Entity
public class Student {
    @Id
    @GeneratedValue
    private Long id;
    
    // Owning side (has JoinTable)
    [[MARK]]// Owning side is responsible for persisting the relationship to the join table[[/MARK]]
    // Saving Student creates STUDENT_COURSE entries; saving Course alone does not
    // Note: Usually NO cascade for N:M (entities should be independent)
    // cascade = PERSIST/MERGE only if you want to save new Courses when saving Student
    [[MARK]]@ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )[[/MARK]]
    private Set<Course> courses = new HashSet<>();
    
    public Set<Course> getCourses() {
        return courses;
    }
    
    public void addCourse(Course course) {
        courses.add(course);
        if (!course.getStudents().contains(this)) {
            course.getStudents().add(this);
        }
    }
    
    public void removeCourse(Course course) {
        courses.remove(course);
        course.getStudents().remove(this);
    }
}

@Entity
public class Course {
    @Id
    @GeneratedValue
    private Long id;
    
    // Inverse side (mappedBy)
    [[MARK]]@ManyToMany(mappedBy = "courses")[[/MARK]]
    private Set<Student> students = new HashSet<>();
    
    public Set<Student> getStudents() {
        return students;
    }
    
    public void addStudent(Student student) {
        students.add(student);
        if (!student.getCourses().contains(this)) {
            student.getCourses().add(this);
        }
    }
    
    public void removeStudent(Student student) {
        students.remove(student);
        student.getCourses().remove(this);
    }
}`,
        output: `// Database structure:
// STUDENT table: id
// COURSE table: id
// STUDENT_COURSE table: student_id (FK), course_id (FK)

// Many Students can enroll in many Courses
// Many Courses can have many Students

// Without cascade: only relationship entries in join table are managed
// Deleting a Student entity deletes STUDENT_COURSE entries, not COURSE entities
// Deleting a Course entity deletes COURSE row (Hibernate removes STUDENT_COURSE entries first)

Student student1 = new Student();
Student student2 = new Student();
Course math = new Course();
Course physics = new Course();

student1.addCourse(math);    // Sets both sides of relationship
student1.addCourse(physics);
student2.addCourse(math);

// Without cascade: must save everything explicitly
session.save(math);          // Save Course entities first
session.save(physics);
session.save(student1);      // Then save Students (creates join table entries)
session.save(student2);`
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
