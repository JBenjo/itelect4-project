import { useState, useEffect, useRef } from "react";
import type { User, Course, Submission } from "./types";
import UserCard from "./components/UserCard";
import CourseCard from "./components/CourseCard";
import SubmissionBadge from "./components/SubmissionBadge";
import useToggle from "./hooks/useToggle";
import usePrevious from "./hooks/usePrevious";

// ===== MOCK DATA =====
const mockUsers: User[] = [
  {
    id: 1,
    name: "Juan Benjo G. Estrella",
    email: "benjoestrella13@gmail.com",
    role: "student",
    isActive: true,
  },
  {
    id: 2,
    name: "Ana Rosa Santos",
    email: "anarosa@example.com",
    role: "student",
    isActive: true,
  },
];

const mockCourses: Course[] = [
  {
    code: "ITSOPRI",
    title: "ITSOPRI",
    units: 3,
    semester: "1st Semester 2026-2027",
  },
  {
    code: "LIFERIZ",
    title: "LIFERIZ",
    units: 3,
    semester: "1st Semester 2026-2027",
  },
];

const mockSubmission: Submission = {
  id: 1,
  studentId: 1,
  courseCode: "ITSOPRI",
  repoUrl: "https://github.com/JBenjo/itelect4-project",
  submittedAt: new Date(),
  score: 100,
};

function App() {
  // ===== STATE =====
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [submission, setSubmission] = useState<Submission | null>(null);

  // ===== REFS & CUSTOM HOOKS =====
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showDetails, toggleDetails] = useToggle(false);
  const [isDarkMode, toggleDarkMode] = useToggle(false);
  const previousSearch = usePrevious(searchTerm);

  // ===== EFFECT =====
  useEffect(() => {
    setTimeout(() => {
      setUsers(mockUsers);
      setCourses(mockCourses);
      setSubmission(mockSubmission);
      setIsLoading(false);
      searchInputRef.current?.focus();
    }, 500);
  }, []);

  // ===== HANDLERS =====
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchTerm(e.target.value);
  };

  // ===== DERIVED VALUES =====
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ===== STYLED EARLY RETURNS =====
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="animate-pulse p-6 text-gray-500 dark:text-gray-400">
          Loading courses...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="m-6 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900 dark:text-red-200">
          Could not load courses. Please try again.
        </div>
      </div>
    );
  }

  // ===== RENDER =====
  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
            GT2 Part 3: Tailwind CSS + UI Polish
          </h1>

          {/* Control Buttons */}
          <div className="mb-4 flex gap-2">
            <button
              onClick={toggleDarkMode}
              className="rounded bg-gray-800 px-3 py-1.5 text-sm text-white dark:bg-gray-200 dark:text-gray-900"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={() => setIsError(true)}
              className="rounded bg-red-100 px-2 py-1 text-xs text-red-700"
            >
              Simulate Error
            </button>
          </div>

          {/* Search Input */}
          <input
            ref={searchInputRef}
            value={searchTerm}
            type="text"
            placeholder="Search courses..."
            onChange={handleSearchChange}
            className="mb-4 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />

          {/* Previous Search */}
          {previousSearch !== undefined && previousSearch !== searchTerm && (
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Previous search: "{previousSearch}"
            </p>
          )}

          {/* Toggle Button */}
          <button
            onClick={toggleDetails}
            className="mb-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {showDetails ? "Hide" : "Show"} Details
          </button>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* User Cards */}
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onSelect={setSelectedUser}
              />
            ))}

            {/* Selected User */}
            {selectedUser && (
              <p className="col-span-full text-blue-600 dark:text-blue-400">
                Selected: {selectedUser.name}
              </p>
            )}

            {/* Course Cards */}
            {showDetails &&
              filteredCourses.map((c) => (
                <CourseCard key={c.code} course={c} variant="compact" />
              ))}

            {/* Submission Badge */}
            {submission && (
              <div className="col-span-full">
                <SubmissionBadge submission={submission}>
                  <p className="font-bold text-green-600 dark:text-green-400">
                    On time!
                  </p>
                </SubmissionBadge>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;