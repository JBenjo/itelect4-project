import type { ApiSubmission, Course, NewSubmission } from "../types";

export const API_URL = "http://localhost:3001";

export async function fetchCourses(): Promise<Course[]> {
  const response = await fetch(`${API_URL}/courses`);

  if (!response.ok) {
    throw new Error("Could not load courses");
  }

  return response.json();
}

export async function fetchCourseByCode(code: string): Promise<Course> {
  const response = await fetch(
    `${API_URL}/courses?code=${encodeURIComponent(code)}`,
  );

  if (!response.ok) {
    throw new Error("Could not load that course");
  }

  const matches: Course[] = await response.json();

  if (matches.length === 0) {
    throw new Error(`No course found with code "${code}".`);
  }

  return matches[0];
}

export async function fetchSubmissions(): Promise<ApiSubmission[]> {
  const response = await fetch(`${API_URL}/submissions`);

  if (!response.ok) {
    throw new Error("Could not load submissions");
  }

  return response.json();
}

export async function createSubmission(
  submission: NewSubmission,
): Promise<ApiSubmission> {
  const response = await fetch(`${API_URL}/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submission),
  });

  if (!response.ok) {
    throw new Error("Could not save the submission");
  }

  return response.json();
}