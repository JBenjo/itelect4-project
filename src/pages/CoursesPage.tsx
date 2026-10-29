// The courses list: fetches every course, filters them with the
// search box (which lives in the ui store, so it survives navigation
// to another page), and links each card to its detail page.
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import type { Course } from "../types";
import { Input } from "@/components/ui/input";
import CourseCard from "../components/CourseCard";
import usePrevious from "../hooks/usePrevious";
import useUiStore from "../store/ui-store";
import { API_URL, fetchCourses } from "../api/client";

export default function CoursesPage() {
  // GET /api/courses, cached under ["courses"]. CourseDetailPage and
  // SubmissionDetailPage ask for the same key, so they reuse this
  // response instead of downloading it again.
  const { data, isPending, isError, error } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  // The search term lives in the shared ui store (see ui-store.ts);
  // the two selectors below read the value and the setter that
  // changes it, so typing here updates every component using it.
  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);
  // The value from the previous render, for the "showing results for"
  // hint below -- it appears only once the term actually changed.
  const prevSearch = usePrevious(searchTerm);

  // Same three-state pattern as CourseDetailPage: loading, error, then
  // the real content. The error even prints which address was tried,
  // which is usually all you need to debug a bad VITE_API_URL.
  if (isPending) {
    return <div className="animate-pulse p-6">Loading courses...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error.message} -- tried {API_URL}/api/courses
      </div>
    );
  }

  // Client-side filtering: no request is sent while typing. Both the
  // title and the code must match, case-insensitively; an empty term
  // matches everything (includes("") is always true).
  const filteredCourses = data.filter((course) => {
    const term = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(term) ||
      course.code.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-7">
      {/* Page header, same structure as DashboardPage. */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Your semester
        </p>
        <h1 className="page-heading text-4xl font-bold text-foreground">Courses</h1>
        <p className="mt-2 text-muted-foreground">
          Browse your enrolled subjects and open a course for its details.
        </p>
      </div>
      
      <div className="surface rounded-2xl border p-4">
        {/* A controlled input: value comes from the store, every keystroke
            writes it back with onChange. */}
        <Input
          type="text"
          placeholder="Search courses by title or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        {/* Shown only when the term changed since the last render, so
            the line does not sit there on first load. */}
        {prevSearch !== undefined && prevSearch !== searchTerm && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Showing results for: {searchTerm || "all courses"}
          </p>
        )}
      </div>

      {/* .map renders one card per filtered course. key must be unique
          per item -- the course code is -- so React can update the list
          without re-creating every node. Each card is wrapped in a Link
          to its detail page. */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <Link key={course.code} to={`/courses/${course.code}`}>
            <CourseCard course={course} />
          </Link>
        ))}
      </div>

      {/* The empty state: reachable by typing something that matches
          nothing. Rendering nothing at all would look like a bug. */}
      {filteredCourses.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400 py-8">
          No courses found.
        </p>
      )}
    </div>
  );
}
