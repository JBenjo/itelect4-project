import UserCard from "./components/UserCard";
import CourseCard from "./components/CourseCard";
import SubmissionBadge from "./components/SubmissionBadge";
import type { User, Course, Submission } from "./types";

const student: User = {
  id: 1,
  name: "Juan Benjo G. Estrella",
  email: "benjoestrella13@gmail.com",
  role: "student",
  isActive: true,
};

const course: Course = {
  code: "ITELECT4",
  title: "IT Elective 4",
  units: 3,
  semester: "1st Semester 2026-2027",
};

const submission: Submission = {
  id: 1,
  studentId: 1,
  courseCode: "ITELECT4",
  repoUrl: "https://github.com/JBenjo/itelect4-project",
  submittedAt: new Date(),
  score: 100,
};

const App = () => {
  const handleSelectUser = (user: User) => {
    console.log("Selected user:", user.name);
    alert(`Selected: ${user.name}`);
  };

  return (
    <main style={{ fontFamily: "Arial, sans-serif", padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>SUBMISSION PROMPT AND GRADES</h1>
      
      <UserCard user={student} onSelect={handleSelectUser} />
      <CourseCard course={course} />
      <SubmissionBadge submission={submission}>
        <p style={{ color: "green", fontWeight: "bold" }}>On time!</p>
      </SubmissionBadge>
    </main>
  );
};

export default App;