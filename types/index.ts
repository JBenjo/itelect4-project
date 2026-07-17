export interface User {
  id: number |string;
  name: string;
  email: string;
  role: "student" | "admin" | "instructor";
  isActive: boolean;
  score?: number;
}

export interface Course {
  code: string;
  title: string;
  units: number;
  semester: string;
}

export interface Submission {
  id: number | string;
  studentId?: number | string;
  courseCode: string;
  repoUrl: string;
  submittedAt: Date;
  score?: number;
}
