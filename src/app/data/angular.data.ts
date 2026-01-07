import { CodeExample, ProgrammingLanguage, Category } from '../models/code-example.model';

export const ANGULAR_EXAMPLES: CodeExample[] = [
  {
    language: ProgrammingLanguage.Angular,
    header: 'How to bind single FormControls to template',
    categories: [Category.ReactiveForms],
    description: '[formControl] directive allows binding standalone FormControl instances directly in the template without a FormGroup.',
    sections: [
      {
        title: 'Component with FormControl',
        codeLabel: 'TypeScript Component',
        hljsLanguage: 'typescript',
        body: `import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  // Create standalone FormControls
  [[MARK]]nameControl = new FormControl('');[[/MARK]]
  [[MARK]]emailControl = new FormControl('');[[/MARK]]
  
  onSubmit() {
    console.log('Name:', this.nameControl.value);
    console.log('Email:', this.emailControl.value);
  }
}`
      },
      {
        title: 'Template with [formControl] binding',
        codeLabel: 'HTML Template',
        hljsLanguage: 'xml',
        body: `<div class="form-container">
  <div class="form-field">
    <label for="name">Name:</label>
    <input 
      id="name" 
      type="text" 
      [[MARK]][formControl]="nameControl"[[/MARK]] 
      placeholder="Enter your name"
    />
  </div>
  
  <div class="form-field">
    <label for="email">Email:</label>
    <input 
      id="email" 
      type="email" 
      [[MARK]][formControl]="emailControl"[[/MARK]] 
      placeholder="Enter your email"
    />
  </div>
  
  <button (click)="onSubmit()">Submit</button>
  
  <div class="values">
    <p>Name: {{ nameControl.value }}</p>
    <p>Email: {{ emailControl.value }}</p>
  </div>
</div>`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Angular,
    header: 'How to to bind FormControls within a FormGroup to template',
    categories: [Category.ReactiveForms],
    description: 'Using FormGroup along with formControlName directives to manage multiple form controls as a group.',
    sections: [
      {
        title: 'Component with FormGroup',
        codeLabel: 'TypeScript Component',
        hljsLanguage: 'typescript',
        body: `import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent {
  // Create a FormGroup with multiple controls
  [[MARK]]profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl('')
  });[[/MARK]]
  
  onSubmit() {
    console.log('Form Data:', this.profileForm.value);
  }
}`
      },
      {
        title: 'Template with [formGroup] and formControlName',
        codeLabel: 'HTML Template',
        hljsLanguage: 'xml',
        body: `<form [[MARK]][formGroup]="profileForm"[[/MARK]] (ngSubmit)="onSubmit()">
  <div class="form-field">
    <label for="firstName">First Name:</label>
    <input 
      id="firstName" 
      type="text" 
      [[MARK]]formControlName="firstName"[[/MARK]]
      placeholder="Enter first name"
    />
  </div>
  
  <div class="form-field">
    <label for="lastName">Last Name:</label>
    <input 
      id="lastName" 
      type="text" 
      [[MARK]]formControlName="lastName"[[/MARK]]
      placeholder="Enter last name"
    />
  </div>
  
  <button type="submit">Submit</button>
  
  <div class="form-values">
    <p>Form Values: {{ profileForm.value | json }}</p>
  </div>
</form>`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Angular,
    header: 'How to add form validation',
    categories: [Category.ReactiveForms],
    sections: [
      {
        title: 'Component with validators',
        codeLabel: 'TypeScript Component',
        hljsLanguage: 'typescript',
        body: `import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registration.component.html'
})
export class RegistrationComponent {
  registrationForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
    age: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(18)
    ])
  });
  
  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Form Data:', this.registrationForm.value);
    } else {
      console.log('Form is invalid');
      this.markAllAsTouched();
    }
  }
  
  markAllAsTouched() {
    Object.keys(this.registrationForm.controls).forEach(key => {
      this.registrationForm.get(key)?.markAsTouched();
    });
  }
  
  getErrorMessage(controlName: string): string {
    const control = this.registrationForm.get(controlName);
    if (!control || !control.errors) return '';
    
    if (control.hasError('required')) return \`\${controlName} is required\`;
    if (control.hasError('minlength')) {
      const minLength = control.errors['minlength'].requiredLength;
      return \`\${controlName} must be at least \${minLength} characters\`;
    }
    if (control.hasError('email')) return 'Invalid email format';
    if (control.hasError('min')) {
      const min = control.errors['min'].min;
      return \`Minimum value is \${min}\`;
    }
    return '';
  }
}`
      },
      {
        title: 'Template with validation messages',
        codeLabel: 'HTML Template',
        hljsLanguage: 'xml',
        body: `<form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
  <div class="form-field">
    <label for="username">Username:</label>
    <input 
      id="username" 
      type="text" 
      formControlName="username"
      placeholder="Min 3 characters"
    />
    <span class="error" 
          *ngIf="registrationForm.get('username')?.invalid && 
                 registrationForm.get('username')?.touched">
      {{ getErrorMessage('username') }}
    </span>
  </div>
  
  <div class="form-field">
    <label for="email">Email:</label>
    <input 
      id="email" 
      type="email" 
      formControlName="email"
      placeholder="your@email.com"
    />
    <span class="error" 
          *ngIf="registrationForm.get('email')?.invalid && 
                 registrationForm.get('email')?.touched">
      {{ getErrorMessage('email') }}
    </span>
  </div>
  
  <div class="form-field">
    <label for="password">Password:</label>
    <input 
      id="password" 
      type="password" 
      formControlName="password"
      placeholder="Min 8 characters"
    />
    <span class="error" 
          *ngIf="registrationForm.get('password')?.invalid && 
                 registrationForm.get('password')?.touched">
      {{ getErrorMessage('password') }}
    </span>
  </div>
  
  <div class="form-field">
    <label for="age">Age:</label>
    <input 
      id="age" 
      type="number" 
      formControlName="age"
      placeholder="Must be 18+"
    />
    <span class="error" 
          *ngIf="registrationForm.get('age')?.invalid && 
                 registrationForm.get('age')?.touched">
      {{ getErrorMessage('age') }}
    </span>
  </div>
  
  <button type="submit">Register</button>
  
  <div class="form-status">
    <p>Form Valid: {{ registrationForm.valid }}</p>
  </div>
</form>`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Angular,
    header: 'How to patch form values',
    categories: [Category.ReactiveForms],
    sections: [
      {
        title: 'Component with patchValue and setValue',
        codeLabel: 'TypeScript Component',
        hljsLanguage: 'typescript',
        body: `import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-editor.component.html'
})
export class UserEditorComponent {
  userForm = new FormGroup({
    id: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl('')
  });
  
  // Load user data (e.g., from an API)
  loadUser() {
    // patchValue: updates only the specified fields
    this.userForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
      // phone is not updated
    });
  }
  
  // Reset with complete data
  resetUser() {
    // setValue: requires ALL fields to be provided
    this.userForm.setValue({
      id: '123',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '555-0100'
    });
  }
  
  onSubmit() {
    console.log('Form Data:', this.userForm.value);
  }
}`
      },
      {
        title: 'Template',
        codeLabel: 'HTML Template',
        hljsLanguage: 'xml',
        body: `<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <div class="form-field">
    <label for="id">ID:</label>
    <input 
      id="id" 
      type="text" 
      formControlName="id"
      placeholder="User ID"
    />
  </div>
  
  <div class="form-field">
    <label for="firstName">First Name:</label>
    <input 
      id="firstName" 
      type="text" 
      formControlName="firstName"
      placeholder="First name"
    />
  </div>
  
  <div class="form-field">
    <label for="lastName">Last Name:</label>
    <input 
      id="lastName" 
      type="text" 
      formControlName="lastName"
      placeholder="Last name"
    />
  </div>
  
  <div class="form-field">
    <label for="email">Email:</label>
    <input 
      id="email" 
      type="email" 
      formControlName="email"
      placeholder="Email address"
    />
  </div>
  
  <div class="form-field">
    <label for="phone">Phone:</label>
    <input 
      id="phone" 
      type="tel" 
      formControlName="phone"
      placeholder="Phone number"
    />
  </div>
  
  <div class="button-group">
    <button type="button" (click)="loadUser()">Load User (Patch)</button>
    <button type="button" (click)="resetUser()">Reset User (Set)</button>
    <button type="submit">Submit</button>
  </div>
  
  <div class="form-values">
    <p>Form Values: {{ userForm.value | json }}</p>
  </div>
</form>`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Angular,
    header: 'How to use FormArray for dynamic form fields',
    categories: [Category.ReactiveForms],
    description: 'FormArray allows to manage a dynamic collection of form controls, enabling users to add or remove fields at runtime. This example shows how to bind a FormArray to an existing data object.',
    sections: [
      {
        title: 'Component with FormArray and data binding',
        codeLabel: 'TypeScript Component',
        hljsLanguage: 'typescript',
        body: `import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface User {
  name: string;
  skills: string[];
}

@Component({
  selector: 'app-skills-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './skills-form.component.html'
})
export class SkillsFormComponent implements OnInit {
  // Initial data object
  user: User = {
    name: 'John',
    skills: ['TypeScript', 'Angular', 'RxJS']
  };
  
  profileForm = new FormGroup({
    name: new FormControl(''),
    [[MARK]]skills: new FormArray<FormControl>([])[[/MARK]]
  });
  
  ngOnInit() {
    // Load data into form
    this.loadUserData();
    
    // Subscribe to form changes to update the user object
    this.profileForm.valueChanges.subscribe(value => {
      this.user = value as User;
    });
  }
  
  // Load user data into the form
  loadUserData() {
    this.profileForm.patchValue({ name: this.user.name });
    
    // Add skills from data
    [[MARK]]this.user.skills.forEach(skill => {
      this.skills.push(new FormControl(skill));
    });[[/MARK]]
  }
  
  [[MARK]]get skills() {
    return this.profileForm.get('skills') as FormArray;
  }[[/MARK]]
  
  [[MARK]]addSkill() {
    this.skills.push(new FormControl(''));
  }[[/MARK]]
  
  [[MARK]]removeSkill(index: number) {
    this.skills.removeAt(index);
  }[[/MARK]]
  
  onSubmit() {
    console.log('User object:', this.user);
  }
}`
      },
      {
        title: 'Template with FormArray',
        codeLabel: 'HTML Template',
        hljsLanguage: 'xml',
        body: `<form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
  <div class="form-field">
    <label for="name">Name:</label>
    <input 
      id="name" 
      type="text" 
      formControlName="name"
      placeholder="Enter your name"
    />
  </div>
  
  <div class="skills-section">
    <h3>Skills</h3>
    <div [[MARK]]formArrayName="skills"[[/MARK]]>
      [[MARK]]@for (skill of skills.controls; track $index; let i = $index)[[/MARK]] {
        <div class="skill-row">
          <input 
            type="text" 
            [[MARK]][formControlName]="i"[[/MARK]]
            placeholder="Enter a skill"
          />
          <button 
            type="button" 
            (click)="removeSkill(i)"
            [disabled]="skills.length === 1"
          >
            Remove
          </button>
        </div>
      }
    </div>
    
    <button type="button" (click)="addSkill()">
      Add Skill
    </button>
  </div>
  
  <button type="submit">Submit</button>
  
  <div class="data-display">
    <h4>Current User Object:</h4>
    <pre>{{ user | json }}</pre>
  </div>
</form>`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Angular,
    header: 'How to use FormBuilder',
    categories: [Category.ReactiveForms],
    description: 'FormBuilder provides a convenient API for creating forms with less boilerplate code. It simplifies form creation with built-in methods for controls, groups, and arrays.',
    sections: [
      {
        title: 'Component with FormBuilder',
        codeLabel: 'TypeScript Component',
        hljsLanguage: 'typescript',
        body: `import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  // Inject FormBuilder
  constructor([[MARK]]private fb: FormBuilder[[/MARK]]) {}
  
  // Create form with FormBuilder
  [[MARK]]profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    hobbies: this.fb.array(['Reading', 'Gaming'])
  });[[/MARK]]
  
  get hobbies() {
    return this.profileForm.get('hobbies') as FormArray;
  }
  
  addHobby() {
    this.hobbies.push(this.fb.control(''));
  }
  
  removeHobby(index: number) {
    this.hobbies.removeAt(index);
  }
  
  onSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
    }
  }
}`
      },
      {
        title: 'Template',
        codeLabel: 'HTML Template',
        hljsLanguage: 'xml',
        body: `<form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
  <div class="form-field">
    <label for="name">Name:</label>
    <input 
      id="name" 
      type="text" 
      formControlName="name"
      placeholder="Enter your name"
    />
  </div>
  
  <div class="form-field">
    <label for="email">Email:</label>
    <input 
      id="email" 
      type="email" 
      formControlName="email"
      placeholder="Enter your email"
    />
  </div>
  
  <div class="hobbies-section">
    <h3>Hobbies</h3>
    <div formArrayName="hobbies">
      @for (hobby of hobbies.controls; track $index; let i = $index) {
        <div class="hobby-row">
          <input 
            type="text" 
            [formControlName]="i"
            placeholder="Enter a hobby"
          />
          <button 
            type="button" 
            (click)="removeHobby(i)"
          >
            Remove
          </button>
        </div>
      }
    </div>
    
    <button type="button" (click)="addHobby()">
      Add Hobby
    </button>
  </div>
  
  <button type="submit" [disabled]="profileForm.invalid">
    Submit
  </button>
</form>`
      }
    ]
  },
  {
    language: ProgrammingLanguage.Angular,
    header: 'How to use Angular Router with parameters',
    categories: [Category.Routing],
    description: 'Angular Router enables navigation between views with support for route parameters. This example shows how to create routes, navigate with parameters, and retrieve them in components.',
    downloadUrl: 'angular-routing-package-zip',
    sections: [
      {
        title: 'Route Configuration',
        codeLabel: 'app.routes.ts',
        hljsLanguage: 'typescript',
        body: `import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ProductListComponent } from './product-list.component';
import { ProductDetailComponent } from './product-detail.component';

[[MARK]]export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent }
];[[/MARK]]`
      },
      {
        title: 'Main App Component with Navigation',
        codeLabel: 'app.component.ts',
        hljsLanguage: 'typescript',
        body: `import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: \`
    <nav>
      [[MARK]]<a routerLink="/">Home</a>
      <a routerLink="/products">Products</a>[[/MARK]]
    </nav>
    [[MARK]]<router-outlet></router-outlet>[[/MARK]]
  \`
})
export class AppComponent {}`
      },
      {
        title: 'Product List with Parameter Links',
        codeLabel: 'product-list.component.ts',
        hljsLanguage: 'typescript',
        body: `import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: \`
    <h2>Products</h2>
    <ul>
      @for (product of products; track product.id) {
        <li>
          [[MARK]]<a [routerLink]="['/products', product.id]">
            {{ product.name }}
          </a>[[/MARK]]
        </li>
      }
    </ul>
  \`
})
export class ProductListComponent {
  products = [
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Phone' },
    { id: 3, name: 'Tablet' }
  ];
}`
      },
      {
        title: 'Product Detail Component with Parameter',
        codeLabel: 'product-detail.component.ts',
        hljsLanguage: 'typescript',
        body: `import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <h2>Product Details</h2>
    <p>Product ID: {{ productId }}</p>
    @if (product) {
      <div>
        <h3>{{ product.name }}</h3>
        <p>Price: {{ product.price }}</p>
      </div>
    }
  \`
})
export class ProductDetailComponent implements OnInit {
  productId: string = '';
  product: any = null;
  
  // Mock product data
  products = [
    { id: '1', name: 'Laptop', price: '$999' },
    { id: '2', name: 'Phone', price: '$699' },
    { id: '3', name: 'Tablet', price: '$499' }
  ];
  
  constructor([[MARK]]private route: ActivatedRoute[[/MARK]]) {}
  
  ngOnInit() {
    // Get the parameter from the route
    this.productId = [[MARK]]this.route.snapshot.paramMap.get('id') || ''[[/MARK]];
    
    // Find the product by ID
    this.product = this.products.find(p => p.id === this.productId);
  }
}`
      }
    ]
  }
];
