import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import type { Course } from "../types";
import { Input } from "@/components/ui/input";
import CourseCard from "../components/CourseCard";
import usePrevious from "../hooks/usePrevious";
import useUiStore from "../store/ui-store";
import { fetchCourses } from "../api/client";

export default function CoursesPage() {
  const { data, isPending, isError, error } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);
  const prevSearch = usePrevious(searchTerm);

  if (isPending) {
    return <div className="animate-pulse p-6">Loading courses...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error.message} - is json-server running on port 3001?
      </div>
    );
  }

  const filteredCourses = data.filter((course) => {
    const term = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(term) ||
      course.code.toLowerCase().includes(term)
    );
  });

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Courses</h1>
      
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search courses by title or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800"
        />
        {prevSearch !== undefined && prevSearch !== searchTerm && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Showing results for: {searchTerm || "all courses"}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Link key={course.code} to={`/courses/${course.code}`}>
            <CourseCard course={course} />
          </Link>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400 py-8">
          No courses found.
        </p>
      )}
    </div>
  );
}
