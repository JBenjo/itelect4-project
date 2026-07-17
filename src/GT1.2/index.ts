// GT1.2 - Advanced Types in TypeScript

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: "student" | "admin" | "instructor";
  isActive: boolean;
}

export interface Course {
  code: string;
  title: string;
  units: number;
  semester: string;
}

export interface Submission {
  id: number | string;
  studentId: number | string;
  courseCode: string;
  repoUrl: string;
  submittedAt: Date;
}

export type ID = number | string;
export type Status = "pending" | "active" | "inactive";
export type StringOrNumber = string | number;

export type StudentWithCourse = User & {
  enrolledCourse: Course;
  gpa: number;
};

export type Formatter = (value: number) => string;

export function printId(id: StringOrNumber): void {
  console.log(`ID: ${id}`);
}

export function formatDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  return value;
}

export function processInput(input: StringOrNumber): string {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  return input.toFixed(2);
}

export function formatScore(value: number): string {
  return `${value}%`;
}

export function createStudent(): StudentWithCourse {
  return {
    id: 1,
    name: "Maria Santos",
    email: "maria@example.com",
    role: "student",
    isActive: true,
    enrolledCourse: {
      code: "ITELECT4",
      title: "IT Elective 4",
      units: 3,
      semester: "1st Semester 2026-2027",
    },
    gpa: 1.25,
  };
}

export function createSubmission(): Submission {
  return {
    id: 1,
    studentId: 1,
    courseCode: "ITELECT4",
    repoUrl: "https://github.com/example/project",
    submittedAt: new Date(),
  };
}

export function showExamples(): void {
  const student = createStudent();
  const submission = createSubmission();

  printId("S2026-001");
  printId(101);
  console.log(processInput("hello"));
  console.log(processInput(3.14));
  console.log(formatDate(new Date()));
  console.log(formatScore(95.5));
  console.log(student);
  console.log(submission);
}
