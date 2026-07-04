// src/sample.ts
import type { User } from "../types/index";

// Function: getUser
function getUser(id: number): User {
  return {
    id: id,
    name: "Juan Benjo G. Estrella",
    email: "Juan Benjo G. Estrella@example.com",
    role: "student",
    isActive: true,
    score: 95.5, 
  };
}

// Function: calculateGrade
function calculateGrade(score: number, maxScore: number): string {
  const percentage: number = (score / maxScore) * 100;
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  return "F";
}

// Function: formatCourse
function formatCourse(name: string, units: number, semester: string): string {
  return `${name} (${units} units) - ${semester}`;
}

// Usage
const user: User = getUser(1);
console.log(user);

const grade: string = calculateGrade(85, 100);
console.log(grade);

const courseInfo: string = formatCourse("IT Elective 4", 3, "1st Semester");
console.log(courseInfo);