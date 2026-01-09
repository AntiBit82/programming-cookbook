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
        title: 'One-to-One (1:1) - Post and PostDetails',
        codeLabel: 'Java Entities',
        hljsLanguage: 'java',
        body: `import javax.persistence.*;

@Entity
@Table(name = "post")
public class Post {
    @Id
    @GeneratedValue
    private Long id;
    
    private String title;
    
    // Inverse side (mappedBy)
    // ALWAYS use LAZY fetch (default EAGER is bad for performance)
    // optional=false: Avoids N+1 query - tells Hibernate child (PostDetails) always exists
    [[MARK]]@OneToOne(
        mappedBy = "post",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY,
        optional = false
    )[[/MARK]]
    private PostDetails details;
    
    public PostDetails getDetails() {
        return details;
    }
    
    // Synchronizes BOTH sides: handles add, remove, and replace
    public void setDetails(PostDetails details) {
        if (details == null) {
            if (this.details != null) {
                this.details.setPost(null);
            }
        } else {
            details.setPost(this);
        }
        this.details = details;
    }
}

@Entity
@Table(name = "post_details")
public class PostDetails {
    @Id
    private Long id;
    
    @Column(name = "created_on")
    private Date createdOn;
    
    @Column(name = "created_by")
    private String createdBy;
    
    // Owning side with @MapsId
    // Child shares parent's Primary Key (id = post_id)
    [[MARK]]@OneToOne(fetch = FetchType.LAZY)
    @MapsId[[/MARK]]
    private Post post;
    
    public Post getPost() {
        return post;
    }
    
    void setPost(Post post) {
        this.post = post;
    }
}`,
        output: `// Database structure:
// POST table: id, title
// POST_DETAILS table: id (PK + FK to post.id), created_on, created_by

// @MapsId: PostDetails shares Post's Primary Key (no separate FK column)
// orphanRemoval=true: Deleting details from Post also deletes PostDetails entity
// optional=false: Performance optimization - avoids N+1 query issue

Post post = new Post();
post.setTitle("High-Performance Java Persistence");

PostDetails details = new PostDetails();
details.setCreatedBy("Antonio");

post.setDetails(details);  // Synchronizes both sides

session.persist(post);     // Cascades to PostDetails

// To remove the details:
// post.setDetails(null); // orphanRemoval deletes PostDetails`
      },
      {
        title: 'One-to-Many (1:N) - Post and Comments',
        codeLabel: 'Java Entities',
        hljsLanguage: 'java',
        body: `import javax.persistence.*;
import java.util.*;

@Entity
@Table(name = "post")
public class Post {
    @Id
    @GeneratedValue
    private Long id;
    
    private String title;
    
    // Inverse side (mappedBy)
    // orphanRemoval: Removing comment from collection deletes it from DB
    [[MARK]]@OneToMany(
        mappedBy = "post",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )[[/MARK]]
    private List<PostComment> comments = new ArrayList<>();
    
    public List<PostComment> getComments() {
        return comments;
    }
    
    // Helper method: ALWAYS synchronize both sides
    public void addComment(PostComment comment) {
        comments.add(comment);
        comment.setPost(this);
    }
    
    // Helper method: ALWAYS synchronize both sides
    public void removeComment(PostComment comment) {
        comments.remove(comment);
        comment.setPost(null);
    }
}

@Entity
@Table(name = "post_comment")
public class PostComment {
    @Id
    @GeneratedValue
    private Long id;
    
    private String review;
    
    // Owning side (has JoinColumn)
    // ALWAYS use LAZY (default EAGER is bad for performance)
    [[MARK]]@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")[[/MARK]]
    private Post post;
    
    public Post getPost() {
        return post;
    }
    
    void setPost(Post post) {
        this.post = post;
    }
    
    // Implement equals/hashCode for collection operations
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PostComment)) return false;
        PostComment that = (PostComment) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}`,
        output: `// Database structure:
// POST table: id, title
// POST_COMMENT table: id, review, post_id (FK)

// Why helper methods? Without synchronized helpers:
// - Domain model inconsistency (one side has ref, other doesn't)
// - Entity state transitions not guaranteed
// - Hard-to-debug issues

Post post = new Post();
post.setTitle("JPA Best Practices");

PostComment comment1 = new PostComment();
comment1.setReview("Great article!");

PostComment comment2 = new PostComment();
comment2.setReview("Very helpful");

post.addComment(comment1);  // Synchronizes both sides
post.addComment(comment2);

session.persist(post);      // Cascades to comments

// To remove a comment:
// post.removeComment(comment1); // orphanRemoval deletes from DB`
      },
      {
        title: 'Many-to-Many (N:M) - Post and Tag',
        codeLabel: 'Java Entities',
        hljsLanguage: 'java',
        body: `import javax.persistence.*;
import org.hibernate.annotations.NaturalId;
import java.util.*;

@Entity
@Table(name = "post")
public class Post {
    @Id
    @GeneratedValue
    private Long id;
    
    private String title;
    
    // Owning side (has JoinTable)
    // Use Set, not List (prevents duplicates, matches join table constraint)
    // Only PERSIST/MERGE cascade (no REMOVE - tags are shared entities)
    [[MARK]]@ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "post_tag",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )[[/MARK]]
    private Set<Tag> tags = new HashSet<>();
    
    public Set<Tag> getTags() {
        return tags;
    }
    
    // Helper: synchronizes both sides
    public void addTag(Tag tag) {
        tags.add(tag);
        tag.getPosts().add(this);
    }
    
    // Helper: synchronizes both sides
    public void removeTag(Tag tag) {
        tags.remove(tag);
        tag.getPosts().remove(this);
    }
    
    // Implement equals/hashCode for Set operations
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Post)) return false;
        Post post = (Post) o;
        return Objects.equals(id, post.id);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}

@Entity
@Table(name = "tag")
public class Tag {
    @Id
    @GeneratedValue
    private Long id;
    
    // Natural business key (unique tag name)
    @NaturalId
    private String name;
    
    // Inverse side (mappedBy)
    [[MARK]]@ManyToMany(mappedBy = "tags")[[/MARK]]
    private Set<Post> posts = new HashSet<>();
    
    public Set<Post> getPosts() {
        return posts;
    }
    
    // Use business key for equals/hashCode (safer than id)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Tag)) return false;
        Tag tag = (Tag) o;
        return Objects.equals(name, tag.name);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}`,
        output: `// Database structure:
// POST table: id, title
// TAG table: id, name (unique)
// POST_TAG table: post_id (FK), tag_id (FK) - composite PK

// Why Set instead of List? 
// - Prevents duplicate tags on same post
// - Matches join table constraint (post_id, tag_id) unique
// - Better remove() performance with equals/hashCode

// Why only PERSIST/MERGE cascade (no REMOVE)?
// - Tags are shared across many posts
// - Deleting a post shouldn't delete tags used by other posts

Post post1 = new Post("JPA with Hibernate");
Post post2 = new Post("Native Hibernate");

Tag java = new Tag("Java");
Tag hibernate = new Tag("Hibernate");

post1.addTag(java);       // Synchronizes both sides
post1.addTag(hibernate);
post2.addTag(java);       // Same tag on multiple posts

session.persist(post1);   // Cascade persists new tags
session.persist(post2);   // Reuses existing java tag

// To dissociate:
// post1.removeTag(java); // Removes only POST_TAG entry, not Tag entity`
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
