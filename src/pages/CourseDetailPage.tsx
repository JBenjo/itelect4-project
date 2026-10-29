// One course, by the code in the URL (/courses/ITELECT4). The data
// comes from the backend through TanStack Query, and the page renders
// one of three states: loading, error, or the course itself.
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import type { Course } from "../types";
import CourseCard from "../components/CourseCard";
import { fetchCourseByCode } from "../api/client";

function CourseDetailPage() {
  // useParams reads the ":code" segment of the current URL; the type
  // argument says which params this route has.
  const { code } = useParams<{ code: string }>();
  // navigate() is the programmatic version of <Link>: used by the
  // "Back to Courses" button below.
  const navigate = useNavigate();

  // One cached GET per course code. queryKey is what the cache entry
  // is stored under -- ["courses", code] keeps every course in its own
  // slot and lets the courses list share the "courses" prefix.
  // enabled: never fires the request if the URL had no code at all.
  const { data, isPending, isError, error } = useQuery<Course>({
    queryKey: ["courses", code],
    queryFn: () => fetchCourseByCode(code!),
    enabled: code !== undefined,
  });

  // Early returns, in order: a pending query shows a pulsing
  // placeholder, a failed one shows the API's own message, and only a
  // successful one reaches the JSX below. Each return means the code
  // after it can assume data exists.
  if (isPending) {
    return <div className="animate-pulse p-6">Loading course...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error.message}
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        {data.title}
      </h2>

      {/* The same card component the courses list uses, full size. */}
      <div className="max-w-sm">
        <CourseCard course={data} />
      </div>

      <button
        onClick={() => navigate("/courses")}
        className="mt-4 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Back to Courses
      </button>
    </div>
  );
}

export default CourseDetailPage;
