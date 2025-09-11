
  import { ExtraQuestion } from "@/util/type"
  
  
  // Sample questions with mixed content
 export const sampleQuestions: ExtraQuestion[] = [
    {
      id: "1",
      title: "Explain React Hooks with Example",
      content: `React Hooks are functions that let you use state and other React features in functional components.

Here's an example of useState hook:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

The useState hook returns an array with two elements:
1. The current state value
2. A function to update the state

Rules of Hooks:
- Only call hooks at the top level
- Only call hooks from React functions`,
      category: "React",
    },
    {
      id: "2",
      title: "CSS Flexbox Layout System",
      content: `Flexbox is a one-dimensional layout method for laying out items in rows or columns.

Basic flexbox container:

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.item {
  flex: 1;
  margin: 10px;
}
\`\`\`

Key properties:
- justify-content: Controls alignment along main axis
- align-items: Controls alignment along cross axis
- flex-wrap: Controls whether items wrap to new lines`,
      category: "CSS",
    },
    {
      id: "3",
      title: "JavaScript Promises and Async/Await",
      content: `Promises represent the eventual completion of an asynchronous operation.

Example with Promise:

\`\`\`javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Data fetched successfully");
    }, 1000);
  });
}

fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
\`\`\`

Using async/await (cleaner syntax):

\`\`\`javascript
async function getData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

Benefits of async/await:
- More readable code
- Better error handling
- Easier debugging`,
      category: "JavaScript",
    },
    {
      id: "4",
      title: "Database Normalization",
      content: `Database normalization is the process of organizing data to reduce redundancy.

First Normal Form (1NF):
- Each column contains atomic values
- No repeating groups

Second Normal Form (2NF):
- Must be in 1NF
- No partial dependencies on composite primary key

Third Normal Form (3NF):
- Must be in 2NF
- No transitive dependencies

Example of unnormalized table:

\`\`\`sql
CREATE TABLE Students (
  student_id INT,
  name VARCHAR(50),
  course1 VARCHAR(30),
  course2 VARCHAR(30),
  instructor1 VARCHAR(30),
  instructor2 VARCHAR(30)
);
\`\`\`

This violates 1NF due to repeating groups. Better approach would be separate tables for students, courses, and enrollments.`,
      category: "Database",
    },
    {
      id: "5",
      title: "Print a square pattern",
      content: `Print a square of * of size n.

For n = 4, output should be:
****
****
****
****

\`\`\`python
def print_square(n):
    for i in range(n):
        for j in range(n):
            print("*", end="")
        print()  # New line after each row

# Usage
print_square(4)
\`\`\`

Alternative approach using string multiplication:

\`\`\`python
def print_square_simple(n):
    for i in range(n):
        print("*" * n)
\`\`\``,
      category: "Programming",
    },
    {
      id: "6",
      title: "What is REST API?",
      content: `REST (Representational State Transfer) is an architectural style for designing networked applications.

Key principles of REST:
1. Stateless - Each request contains all information needed
2. Client-Server - Separation of concerns
3. Cacheable - Responses should be cacheable when possible
4. Uniform Interface - Consistent way to interact with resources

HTTP Methods in REST:
- GET: Retrieve data
- POST: Create new resource
- PUT: Update existing resource
- DELETE: Remove resource

Example REST endpoints:

\`\`\`
GET /api/users          // Get all users
GET /api/users/123      // Get user with ID 123
POST /api/users         // Create new user
PUT /api/users/123      // Update user with ID 123
DELETE /api/users/123   // Delete user with ID 123
\`\`\``,
      category: "Web Development",
    },
  ]