import { useState } from "react";
import { Link } from "react-router";
import CourseCard from "../components/CourseCard";
import { allCourses } from "../data/mockData";
import usePrevious from "../hooks/usePrevious";

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const prevSearch = usePrevious(searchTerm);

  const filteredCourses = allCourses.filter((course) => {
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
        <input
          type="text"
          placeholder="Search courses by title or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800"
        />
        {prevSearch && prevSearch !== searchTerm && (
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
