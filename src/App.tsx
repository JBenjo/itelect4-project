// ===== SESSION 12 (MA2): explanatory comments added =====
// App.tsx is the routing table of the whole site. React Router reads
// these nested <Route> elements and turns them into URLs:
//
//   /                     DashboardPage
//   /courses              CoursesPage (list)
//   /courses/:code        CourseDetailPage (one course, code in the URL)
//   /login, /register     the two public forms
//   /submissions          SubmissionsPage        (behind ProtectedRoute)
//   /submissions/:id      SubmissionDetailPage   (behind ProtectedRoute)
//   /review               ReviewPage, the AI page(behind ProtectedRoute)
//   *                     NotFoundPage (any unknown URL)
//
// Everything sits inside the first <Route element={<Layout />}>: Layout
// renders the nav bar and the shared page frame once, and <Outlet /> in
// Layout is where each matched child page is placed.
import { Routes, Route } from "react-router";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SubmissionsPage from "./pages/SubmissionsPage";
import SubmissionDetailPage from "./pages/SubmissionDetailPage";
import ReviewPage from "./pages/ReviewPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    // <Routes> picks the FIRST <Route> whose path matches the address
    // bar; <Route path="*"> at the bottom is the fallback for any URL
    // that matched nothing above it.
    <Routes>
      {/* The parent route: no path of its own, so "/" both matches it
          and renders the index child below. It provides the nav bar
          (Layout) to every route nested inside. */}
      <Route path="/" element={<Layout />}>
        {/* index: exactly "/" with nothing after it. */}
        <Route index element={<DashboardPage />} />

        <Route path="courses" element={<CoursesPage />} />

        {/* The colon means "a parameter": this matches /courses/ITELECT4
            too, and CourseDetailPage reads the value with useParams(). */}
        <Route
          path="courses/:code"
          element={<CourseDetailPage />}
        />

        <Route path="login" element={<LoginPage />} />

        {/* Public, like login: you cannot be logged in yet. */}
        <Route path="register" element={<RegisterPage />} />

        {/* ProtectedRoute has no path: it is a GUARD route. It renders
            <Outlet /> (the child below) only when a token exists in the
            auth store; otherwise it <Navigate>s the visitor to /login.
            The children share the guard without repeating it. */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="submissions"
            element={<SubmissionsPage />}
          />
          <Route
            path="submissions/:id"
            element={<SubmissionDetailPage />}
          />
          {/* Session 11: behind the same guard -- the API refuses it
              without a token anyway, so the page should not offer it. */}
          <Route path="review" element={<ReviewPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
