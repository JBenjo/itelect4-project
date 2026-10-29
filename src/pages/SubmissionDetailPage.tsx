// One submission, by the id in the URL. It runs TWO queries: the
// submission itself, and the course list -- the second only to show
// the course's title and units next to the submission's course code.
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

import { fetchCourses, fetchSubmissionById } from "@/api/client";
import useAuthStore from "@/store/authStore";

export default function SubmissionDetailPage() {
  // The ":id" segment of /submissions/:id, read straight from the URL.
  const { id } = useParams<{ id: string }>();
  // The logged-in student's name, for the welcome line. Reading it
  // here (instead of passing it down) is what the auth store is for.
  const { userName } = useAuthStore();

  // GET /api/submissions/:id, cached per id. enabled: !!id turns the
  // string into a boolean -- no id in the URL, no request.
  const submissionQuery = useQuery({
    queryKey: ["submission", id],
    queryFn: () => fetchSubmissionById(id!),
    enabled: !!id,
  });

  // Shares its ["courses"] key with CoursesPage: if the student just
  // visited the list, this resolves from cache with no network call.
  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  // Both queries must be settled before anything below runs.
  if (submissionQuery.isPending || coursesQuery.isPending) {
    return <div className="animate-pulse p-6">Loading submission...</div>;
  }

  if (submissionQuery.isError || coursesQuery.isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {/* Whichever query failed, show its message; fall back to a
            generic sentence if somehow neither has one. */}
        {(submissionQuery.isError
          ? submissionQuery.error.message
          : coursesQuery.error?.message) || "Failed to load"}
      </div>
    );
  }

  // Past the guards: data definitely exists here.
  const submission = submissionQuery.data;
  // Join the two results in memory: find the course whose code matches
  // this submission's. undefined means the course list has no match,
  // and every use of course below handles that.
  const course = coursesQuery.data?.find((c) => c.code === submission.courseCode);

  return (
    <div className="py-8">
      <h1 className="mb-2 text-3xl font-bold">Submission Details</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Welcome, {userName}!
      </p>

      {/* One bordered card holding four labelled rows of read-only
          data. The label is a <span>, the value a <p> under it. */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="grid gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Course
            </span>
            {/* Show the full "CODE - Title" when the course was found;
                otherwise the code alone still tells the student what
                they submitted. */}
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
              {/* target="_blank" opens a new tab; rel="noopener
                  noreferrer" is the required companion -- it stops the
                  new page from reaching back into this app via
                  window.opener. */}
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
            {/* score is optional in the type: ?? prints "Pending" when
                the instructor has not graded it yet. */}
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {submission.score ?? "Pending"}
            </p>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Submitted At
            </span>
            {/* submittedAt is an ISO string; new Date() parses it and
                toLocaleString() prints it in the viewer's own clock
                and format ("10/17/2026, 10:15:00 AM"). */}
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date(submission.submittedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
