import { useState, useEffect, useRef } from "react";
import type { User, Course, Submission } from "./types";
import UserCard from "./components/UserCard";
import CourseCard from "./components/CourseCard";
import SubmissionBadge from "./components/SubmissionBadge";
import useToggle from "./hooks/useToggle";
import usePrevious from "./hooks/usePrevious";

// ===== MOCK DATA (used inside useEffect, NOT directly in JSX) =====
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
    name: "Jane Paray",
    email: "jane.paray@example.com",
    role: "student",
    isActive: true,
  },
  {
    id: 3,
    name: "Clare Mari Katigbak",
    email: "clare.mari@example.com",
    role: "instructor",
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
  {
    code: "CAPROJ 2",
    title: "CAPROJ 2",
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
  // ===== 1. TYPED STATE WITH useState<T> (Requirement: 2+ pieces) =====
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [submission, setSubmission] = useState<Submission | null>(null);

  // ===== 3. TYPED DOM REFERENCE WITH useRef (Requirement) =====
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ===== 5. CUSTOM HOOKS (Requirement: 2 hooks) =====
  const [showDetails, toggleDetails] = useToggle(false);
  const previousSearch = usePrevious(searchTerm);

  // ===== 2. LOAD MOCK DATA WITH useEffect (Requirement) =====
  useEffect(() => {
    // Simulates an API call with setTimeout
    setTimeout(() => {
      setUsers(mockUsers);
      setCourses(mockCourses);
      setSubmission(mockSubmission);
      setIsLoading(false);

      // Focus the search input after data loads
      searchInputRef.current?.focus();
    }, 500);
  }, []);

  // ===== 4. TYPED onChange HANDLER (Requirement) =====
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchTerm(e.target.value);
  };

  // Derived value — recomputed every render, NOT stored in state
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state while data is being "fetched"
  if (isLoading) {
    return <p>Loading courses...</p>;
  }

  return (
    <main style={{ fontFamily: "Arial, sans-serif", padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>GT2 Part 2: React Hooks + State</h1>

      {/* Search input wired to useRef + useState + typed onChange */}
      <input
        ref={searchInputRef}
        value={searchTerm}
        type="text"
        placeholder="Search courses..."
        onChange={handleSearchChange}
        style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
      />

      {/* Show previous search term using usePrevious custom hook */}
      {previousSearch !== undefined && previousSearch !== searchTerm && (
        <p>Previous search: "{previousSearch}"</p>
      )}

    

      {/* User list for selection */}
      {users.map((user) => (
        <UserCard key={user.id} user={user} onSelect={setSelectedUser} />
      ))}

      {/* Show selected user dynamically from state */}
      {selectedUser && (
        <p style={{ color: "blue" }}>Selected: {selectedUser.name}</p>
      )}

      {/* Toggle button using useToggle custom hook */}
      <button onClick={toggleDetails}>
        {showDetails ? "Hide" : "Show"} Details
      </button>

      {/* Render courses dynamically from state (not hard-coded) */}
      {showDetails && filteredCourses.length > 0 ? (
        filteredCourses.map((c) => (
          <CourseCard key={c.code} course={c} />
        ))
      ) : (
        <p>No courses found.</p>
      )}

      {/* Render submission dynamically from state */}
      {submission && (
        <SubmissionBadge submission={submission}>
          <p style={{ color: "green", fontWeight: "bold" }}>On time!</p>
        </SubmissionBadge>
      )}
    </main>
  );
}

export default App;