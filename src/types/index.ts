// ===== INTERFACES =====
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
  score?: number;
}

export interface GreetingProps {
  name: string;
  age?: number;
}

// ===== GENERICS =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

export function getById<T extends { id: number | string }>(items: T[], id: number | string): T | undefined {
  return items.find((item) => item.id === id);
}

// ===== UTILITY TYPES =====
export type UserUpdate = Partial<User>;
export type UserPreview = Pick<User, "id" | "name" | "role">;
export type PublicUser = Omit<User, "email" | "isActive">;
export type RoleCount = Record<"student" | "admin" | "instructor", number>;

// ===== ENUMS =====
export enum SubmissionStatus {
  Pending,
  Graded,
  Late,
}

export const enum Role {
  Student = "student",
  Admin = "admin",
  Instructor = "instructor",
}