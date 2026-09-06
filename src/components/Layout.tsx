import { NavLink, Outlet } from "react-router";
import useUiStore from "../store/ui-store";
import { useAuthStore } from "../store/authStore";

function Layout() {
  const isDarkMode = useUiStore((state) => state.isDarkMode);
  const toggleDarkMode = useUiStore((state) => state.toggleDarkMode);

  const userName = useAuthStore((state) => state.userName);
  const logout = useAuthStore((state) => state.logout);

  const base = "rounded px-3 py-1.5 text-sm";

  const activeLink =
    `${base} bg-blue-600 font-semibold text-white`;

  const idleLink =
    `${base} text-gray-700 hover:bg-gray-200 dark:text-gray-300`;

  const linkClass = ({ isActive }: { isActive: boolean }): string =>
    isActive ? activeLink : idleLink;

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-transparent">
        <nav className="app-nav sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b p-4">
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

          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/courses" className={linkClass}>
            Courses
          </NavLink>

          <NavLink to="/submissions" className={linkClass}>
            Submissions
          </NavLink>

          {userName === null ? (
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
          ) : (
            <button
              onClick={logout}
                className="rounded px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              Logout ({userName})
            </button>
          )}

          <button
            onClick={toggleDarkMode}
            className="ml-auto rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-muted"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </nav>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;