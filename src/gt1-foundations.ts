import { getFirst, SubmissionStatus, Role } from "./types";
import type {
  User,
  Course,
  Submission,
  ApiResponse,
  UserUpdate,
  UserPreview,
  RoleCount,
} from "./types";

// 1. PRIMITIVES
const projectName: string = "itelect4-project";
const currentYear: number = 2026;
const isFullStack: boolean = true;
const nothing: null = null;
const notSet: undefined = undefined;

function greet(name: string, year: number): string {
  return `Welcome to ${name} -- AY ${year}!`;
}

function logMessage(message: string): void {
  console.log(message);
}

// 2. SPECIAL TYPES
let anything: any = "hello"; // Avoid in production
let userInput: unknown = "test";
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase());
}

function throwError(message: string): never {
  throw new Error(message);
}

if (false) {
  throwError("This is a never-returning example");
}

logMessage("Log message example");

// 3. MOCK DATA (Using Interfaces)
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
  repoUrl: "https://github.com/user/repo",
  submittedAt: new Date(),
  score: 95,
};

// 4. UNIONS & INTERSECTIONS
type ID = number | string;
type StringOrNumber = string | number;

function printId(id: ID): void {
  console.log(`ID: ${id}`);
}

type StudentWithCourse = User & { enrolledCourse: Course; gpa: number };
const topStudent: StudentWithCourse = {
  ...student,
  enrolledCourse: course,
  gpa: 1.25,
};

// 5. TYPE NARROWING
function processInput(input: StringOrNumber): string {
  if (typeof input === "string") return input.toUpperCase();
  return input.toFixed(2);
}

function formatDate(value: string | Date): string {
  if (value instanceof Date) return value.toLocaleDateString();
  return value;
}

// 6. GENERICS & 7. UTILITY TYPES USAGE
const userResponse: ApiResponse<User> = { success: true, data: student };
const patch: UserUpdate = { name: "Juan D. Cruz" };
const preview: UserPreview = { id: 1, name: "Juan dela Cruz", role: "student" };
const roleCount: RoleCount = { student: 45, admin: 2, instructor: 3 };

// 8. ENUMS USAGE
let status: SubmissionStatus = SubmissionStatus.Pending;
console.log(SubmissionStatus[status]); // Reverse mapping: "Pending"
const currentRole: Role = Role.Student;
console.log(`Current role value: ${currentRole}`);

// Execution proof
console.log(greet(projectName, currentYear));
console.log(processInput("hello"));
console.log(formatDate(new Date()));
console.log(getFirst<User>([student])?.name);
console.log(roleCount);
console.log(anything);
console.log(nothing, notSet);
console.log(isFullStack);
console.log(submission.courseCode);
printId(student.id);
console.log(topStudent.enrolledCourse.title);
console.log(userResponse.success, userResponse.data.name);
console.log(patch.name);
console.log(preview.id, preview.name);
