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
  }
];
