// The main student page: a list of their submissions, plus the form
// that adds one. It shows the app's three server interactions side by
// side -- a QUERY (read the list), a MUTATION (create one), and Zod
// validation that stops bad input before any request is sent.
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmissionBadge from "@/components/SubmissionBadge";
import { createSubmission, fetchCourses, fetchSubmissions } from "@/api/client";
import type { ApiSubmission, Course } from "@/types";
import { submissionSchema, type SubmissionFormValues } from "@/schemas/submissionSchema";
import useAuthStore from "@/store/authStore";

export default function SubmissionsPage() {
  const { userName } = useAuthStore();
  // Programmatic navigation: used after clicking "View Details".
  const navigate = useNavigate();
  // A handle on the Query cache, needed after the mutation below so
  // the list can be told it is stale and refetched.
  const queryClient = useQueryClient();

  // QUERY 1: GET /api/submissions (the token is added by client.ts).
  const { data, isPending, isError, error } = useQuery<ApiSubmission[]>({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
  });
  // QUERY 2: the courses, only to fill the <select>. It shares the
  // ["courses"] key with CoursesPage, so it is usually already cached.
  const courses = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  // react-hook-form: register() spreads name/onChange/onBlur/value
  // onto each field; handleSubmit only calls onSubmit when the
  // resolver (Zod, below) approves every value. mode: "onBlur" means
  // each field is checked when you leave it, not on every keystroke.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    mode: "onBlur",
    defaultValues: {
      courseCode: "",
      repoUrl: "",
    },
  });

  // MUTATION: POST /api/submissions. On success the cache entry for
  // the list is invalidated, which makes TanStack Query refetch it and
  // the new submission appears without a manual reload; reset() then
  // empties the form for the next one.
  const addSubmission = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      reset();
    },
  });

  // Only reached with valid values -- handleSubmit guarantees it.
  const onSubmit = (values: SubmissionFormValues): void => {
    addSubmission.mutate(values);
  };

  // Loading and error states for BOTH queries before the page body.
  if (isPending || courses.isPending) {
    return <div className="animate-pulse p-6">Loading submissions...</div>;
  }

  if (isError || courses.isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {isError ? error.message : courses.error?.message}
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="mb-2 text-3xl font-bold">My Submissions</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Welcome, {userName}!
      </p>

      {/* THE FORM. onSubmit goes through handleSubmit, so the Zod
          schema decides whether anything is sent: a rejected value
          shows the messages below and never reaches the API. */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-8 grid max-w-xl gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        {/* Field 1: the course <select>. {...register("courseCode")}
            wires the field to the form under that name; aria-invalid
            is what screen readers use to flag the field as broken. */}
        <div className="grid gap-1.5">
          <Label htmlFor="courseCode">Course</Label>
          <select
            id="courseCode"
            {...register("courseCode")}
            aria-invalid={errors.courseCode ? true : undefined}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {/* Empty value "" is what the schema rejects with
                "Choose a course." */}
            <option value="">Select a course...</option>
            {courses.data.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code}
              </option>
            ))}
          </select>
          {/* The schema's own sentence, printed under the field it
              belongs to. role="alert" makes it announced to
              assistive technology the moment it appears. */}
          {errors.courseCode && (
            <p className="text-sm text-red-600" role="alert">
              {errors.courseCode.message}
            </p>
          )}
        </div>

        {/* Field 2: the repository URL, validated by submissionSchema
            (a real URL, on github.com). */}
        <div className="grid gap-1.5">
          <Label htmlFor="repoUrl">Repository URL</Label>
          <Input
            id="repoUrl"
            {...register("repoUrl")}
            aria-invalid={errors.repoUrl ? true : undefined}
            placeholder="https://github.com/you/your-repo"
          />
          {errors.repoUrl && (
            <p className="text-sm text-red-600" role="alert">
              {errors.repoUrl.message}
            </p>
          )}
        </div>

        {/* Disabled while the POST is in flight, so a double click
            cannot create two submissions; the label changes to show
            the request is happening. */}
        <Button
          type="submit"
          disabled={addSubmission.isPending}
          className="justify-self-start"
        >
          {addSubmission.isPending ? "Saving..." : "Add submission"}
        </Button>

        {/* Server-side failure (401, 409, network): the API's own
            message, shown inside the form where the student is
            looking. Validation errors never get here -- they stop at
            handleSubmit. */}
        {addSubmission.isError && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {addSubmission.error.message}
          </p>
        )}
      </form>

      {/* The list: one SubmissionBadge per submission. key is the
          unique id; onViewDetails navigates to the detail page for
          that exact submission, and "View Details" is passed as the
          badge's children (its button text). */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((submission) => (
          <SubmissionBadge
            key={submission.id}
            submission={submission}
            onViewDetails={() => navigate(`/submissions/${submission.id}`)}
          >
            View Details
          </SubmissionBadge>
        ))}
      </div>

      {/* Empty state, for a student with nothing submitted yet. */}
      {data.length === 0 && (
        <p className="py-8 text-center text-gray-600 dark:text-gray-400">
          No submissions yet.
        </p>
      )}
    </div>
  );
}
