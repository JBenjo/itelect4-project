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

// Session 1 said id was a number and studentId was a number, because
// there was no database to number the rows. MongoDB stores an ObjectId
// and sends back 24 hex characters, so both move into the Omit and
// come back as strings.
export type ApiSubmission = Omit<
  Submission,
  "id" | "studentId" | "submittedAt"
> & {
  id:          string;   // 24 hex characters, from MongoDB's _id
  studentId:   string;   // the owner's _id, also 24 hex characters
  submittedAt: string;   // an ISO string, never a Date object
};

// What we SEND when creating one. Not Omit<ApiSubmission, "id"> any
// more: the server fills in studentId from the token and submittedAt
// from the schema default, so sending either one is at best ignored
// and at worst a lie. These two fields are the whole request body,
// and itelect4-backend's NewSubmissionBody is this same Pick.
export type NewSubmission = Pick<Submission, "courseCode" | "repoUrl">;

// What /api/auth/register sends back, and what sits inside the login
// reply. Same story as ApiSubmission: Session 1 said id was a number
// because there was no database to number the rows.
export type ApiUser = Omit<User, "id"> & {
  id: string;
};

// What /api/auth/login sends back. The token is the string that goes
// in the Authorization header on every request after this one.
export interface AuthReply {
  token: string;
  user:  ApiUser;
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

// ===== SESSION 11: what POST /api/ai sends back =======================
// The fourth time a shape is copied across the two repos, and the
// same rule as the first three: itelect4-backend's Review type is
// derived from a Zod schema in src/schemas/review.ts, and this has
// to say the same thing. Nothing checks that they agree -- you do.
export interface AiReview {
  summary:      string;
  strengths:    string[];
  improvements: string[];
  readiness:    "ready" | "almost" | "not-yet";
}