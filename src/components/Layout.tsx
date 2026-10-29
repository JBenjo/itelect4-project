// The shell every page shares: the nav bar across the top and the
// page frame around the content. React Router renders it as a
// layout route (see App.tsx) -- the matched child page appears where
// <Outlet /> is, below, so the nav never remounts when navigating.
import { NavLink, Outlet } from "react-router";
import useUiStore from "../store/ui-store";
import useAuthStore from "../store/authStore";

function Layout() {
  // Dark mode comes from the ui store (persisted to localStorage);
  // the whole page is wrapped in a div carrying the "dark" class
  // below, which Tailwind's dark: variants key off.
  const isDarkMode = useUiStore((state) => state.isDarkMode);
  const toggleDarkMode = useUiStore((state) => state.toggleDarkMode);

  // The auth store: userName is null while logged out, and logout()
  // clears the session. The nav branches on it at the bottom.
  const userName = useAuthStore((state) => state.userName);
  const logout = useAuthStore((state) => state.logout);

  // Shared class fragments, so every nav link looks identical unless
  // it is the one currently open.
  const base = "rounded px-3 py-1.5 text-sm";

  const activeLink =
    `${base} bg-blue-600 font-semibold text-white`;

  const idleLink =
    `${base} text-gray-700 hover:bg-gray-200 dark:text-gray-300`;

  // NavLink calls this for every link with its own state: isActive is
  // true for the link whose path matches the current URL, so the
  // current page's link is always the highlighted one.
  const linkClass = ({ isActive }: { isActive: boolean }): string =>
    isActive ? activeLink : idleLink;

  return (
    // The "dark" class here is what activates every dark: utility in
    // the page below it.
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-transparent">
        {/* app-nav is sticky: it stays at the top while the content
            scrolls under it. flex-wrap lets it collapse onto several
            rows on narrow screens instead of overflowing. */}
        <nav className="app-nav sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b p-4">
          {/* The wordmark: an "ST" tile plus the site name and a small
              uppercase tagline. */}
          <span className="app-brand mr-3 flex items-center gap-3 font-bold text-foreground">
            <span className="app-brand-mark grid size-9 place-items-center rounded-xl text-sm text-primary-foreground">
              ST
            </span>
            <span>
              Submission Tracker
              <small className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                ITELECT4 workspace
              </small>
            </span>
          </span>

          {/* "end" matters only for "/": without it "/" would also
              match /courses, and the Dashboard link would stay lit
              everywhere. */}
          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/courses" className={linkClass}>
            Courses
          </NavLink>

          <NavLink to="/submissions" className={linkClass}>
            Submissions
          </NavLink>

          {/* Session 11: the one page that talks to Gemini */}
          <NavLink to="/review" className={linkClass}>AI Review</NavLink>

          {/* The nav's only conditional: logged out shows Login and
              Register, logged in shows a Logout button labelled with
              the user's name instead. */}
          {userName === null ? (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>
            </>
          ) : (
            <button
              onClick={logout}
                className="rounded px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              Logout ({userName})
            </button>
          )}

          {/* ml-auto pushes this to the far right edge of the nav row.
              It only flips the store flag; the class swap on the
              wrapper div above does the rest. */}
          <button
            onClick={toggleDarkMode}
            className="ml-auto rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-muted"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </nav>

        {/* app-main is where the matched child route is injected --
            the page changes, this frame does not. */}
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
