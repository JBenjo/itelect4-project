import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmissionBadge from "@/components/SubmissionBadge";
import { createSubmission, fetchCourses, fetchSubmissions } from "@/api/client";
import type { ApiSubmission, Course } from "@/types";
import { submissionSchema, type SubmissionFormValues } from "@/schemas/submissionSchema";
import { useAuthStore } from "@/store/authStore";

export default function SubmissionsPage() {
  const { userName } = useAuthStore();
  const queryClient = useQueryClient();
  const { data, isPending, isError, error } = useQuery<ApiSubmission[]>({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
  });
  const courses = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

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

  const addSubmission = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      reset();
    },
  });

  const onSubmit = (values: SubmissionFormValues): void => {
    addSubmission.mutate({
      studentId: 1,
      courseCode: values.courseCode,
      repoUrl: values.repoUrl,
      submittedAt: new Date().toISOString(),
    });
  };

  if (isPending || courses.isPending) {
    return <div className="animate-pulse p-6">Loading submissions...</div>;
  }

  if (isError || courses.isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {isError ? error.message : courses.error?.message} - is json-server
        running on port 3001?
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="mb-2 text-3xl font-bold">My Submissions</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Welcome, {userName}!
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-8 grid max-w-xl gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="grid gap-1.5">
          <Label htmlFor="courseCode">Course</Label>
          <select
            id="courseCode"
            {...register("courseCode")}
            aria-invalid={errors.courseCode ? true : undefined}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select a course...</option>
            {courses.data.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code}
              </option>
            ))}
          </select>
          {errors.courseCode && (
            <p className="text-sm text-red-600" role="alert">
              {errors.courseCode.message}
            </p>
          )}
        </div>

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

        <Button
          type="submit"
          disabled={addSubmission.isPending}
          className="justify-self-start"
        >
          {addSubmission.isPending ? "Saving..." : "Add submission"}
        </Button>

        {addSubmission.isError && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {addSubmission.error.message}
          </p>
        )}
      </form>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((submission) => (
          <SubmissionBadge key={submission.id} submission={submission}>
            View Details
          </SubmissionBadge>
        ))}
      </div>

      {data.length === 0 && (
        <p className="py-8 text-center text-gray-600 dark:text-gray-400">
          No submissions yet.
        </p>
      )}
    </div>
  );
}
