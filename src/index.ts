import type { User, Course, Submission } from "../types/index";


// ===== PRIMITIVE TYPE ANNOTATIONS =====
 
// Variables with explicit types
const projectName: string  = "itelect4-project";
const currentYear: number  = 2026;
const isFullStack: boolean = true;
const nothing:     null    = null;
const notSet:      undefined = undefined;
 
// Function: typed parameters + typed return value
function greet(name: string, year: number): string {
  return `Welcome to ${name} -- AY ${year}!`;
}
 
// void: function that does NOT return a value
function logMessage(message: string): void {
  console.log(message);
}
 
logMessage(greet(projectName, currentYear));

// ===== SPECIAL TYPES =====
 
// any -- disables TypeScript type checking
// [!] Avoid using this; it defeats the purpose of TypeScript
let anything: any = "hello";
anything = 42;      // No error
anything = true;    // No error
 
// unknown -- the safer version of any
// You MUST check the type before using it
let userInput: unknown = "test";
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase()); // OK -- TypeScript knows it's a string here
}
 
// never -- a function that NEVER returns
// Used when a function always throws an error or loops forever
function throwError(message: string): never {
  throw new Error(message);
}
// ===== USING INTERFACES =====
const student: User = {
  id: 1,
  name: "Juan dela Cruz",
  email: "juan@example.com",
  role: "student",
  isActive: true,
};

const course: Course = {
  code: "ITELECT4",
  title: "IT Elective 4",
  units: 3,
  semester: "1st Semester 2026-2027",
};

const submission: Submission = {
  id: 1,
  studentId: 1,
  courseCode: "ITELECT4",
  repoUrl: "https://example.com/repo",
  submittedAt: new Date(),
};

console.log(student);
console.log(course);
console.log(submission);

// ===== TYPE ALIASES =====
// A type alias gives a name to any type -- primitives, unions, functions, objects
 
// Alias for a union type (string OR number)
export type ID = number | string;
 
// Alias for an object shape
export type Coordinate = {
  x: number;
  y: number;
};
 
// Alias for a function signature
export type Formatter = (value: number) => string;
 
// Using them
const studentId: ID = "S2026-001";
const position: Coordinate = { x: 10, y: 20 };
const formatScore: Formatter = (value) => `${value}%`;
 
console.log(studentId);          // S2026-001
console.log(formatScore(95.5));  // 95.5%

// ===== UNION TYPES -- One OR the other =====
export type StringOrNumber = string | number;
export type Status         = "pending" | "active" | "inactive"; // literal union
 
// Function that accepts a union type
export function printId(id: StringOrNumber): void {
  console.log(`ID: ${id}`);
}
printId(101);
printId("S2026-001");
 
// ===== INTERSECTION TYPES -- combines ALL properties =====
// StudentWithCourse must have all User fields AND enrolledCourse AND gpa
export type StudentWithCourse = User & {
  enrolledCourse: Course;
  gpa:            number;
};
 
const topStudent: StudentWithCourse = {
  id: 1, name: "Maria Santos", email: "m@example.com",
  role: "student", isActive: true,
  enrolledCourse: { code: "ITELECT4", title: "IT Elective 4", units: 3, semester: "1st" },
  gpa: 1.25,
};


// ===== TYPE NARROWING =====

// Narrowing with typeof
// Without the if-check, TypeScript would error:
// Property 'toUpperCase' does not exist on type 'number'
function processInput(input: StringOrNumber): string {
  if (typeof input === "string") {
    return input.toUpperCase();  // TypeScript knows: input is string here
  }
  return input.toFixed(2);       // TypeScript knows: input is number here
}
 
// Narrowing with instanceof
// Used with class instances like Date, Error, etc.
function formatDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toLocaleDateString();  // TypeScript knows: it's a Date
  }
  return value;                         // TypeScript knows: it's a string
}
 
console.log(processInput("hello"));   // HELLO
console.log(processInput(3.14159));   // 3.14
console.log(formatDate(new Date())); // e.g. 7/4/2026
