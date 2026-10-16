import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

import { fetchCourses, fetchSubmissionById } from "@/api/client";
import useAuthStore from "@/store/authStore";

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { userName } = useAuthStore();

  const submissionQuery = useQuery({
    queryKey: ["submission", id],
    queryFn: () => fetchSubmissionById(id!),
    enabled: !!id,
  });

  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  if (submissionQuery.isPending || coursesQuery.isPending) {
    return <div className="animate-pulse p-6">Loading submission...</div>;
  }

  if (submissionQuery.isError || coursesQuery.isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {(submissionQuery.isError
          ? submissionQuery.error.message
          : coursesQuery.error?.message) || "Failed to load"}
      </div>
    );
  }

  const submission = submissionQuery.data;
  const course = coursesQuery.data?.find((c) => c.code === submission.courseCode);

  return (
    <div className="py-8">
      <h1 className="mb-2 text-3xl font-bold">Submission Details</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Welcome, {userName}!
      </p>

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="grid gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Course
            </span>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {course ? `${submission.courseCode} - ${course.title}` : submission.courseCode}
            </p>
            {course && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {course.units} units • {course.semester}
              </p>
            )}
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Repository
            </span>
            <p className="text-gray-900 dark:text-white">
              <a
                href={submission.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {submission.repoUrl}
              </a>
            </p>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Score
            </span>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {submission.score ?? "Pending"}
            </p>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Submitted At
            </span>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date(submission.submittedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
