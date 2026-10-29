// The guard for every page that needs a login. It is a layout route:
// it has no path of its own (see App.tsx), and it decides whether the
// routes nested under it are allowed to render.
import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store/authStore";

function ProtectedRoute() {
  // Read the token straight from the Zustand store. token === null
  // means nobody is logged in (or the session was cleared).
  const token = useAuthStore((state) => state.token);

  // No token: send the visitor to the login page instead of rendering
  // the children. "replace" keeps /submissions out of the back-button
  // history, so Back does not bounce between login and the page.
  if (token === null) {
    return <Navigate to="/login" replace />;
  }

  // Token exists: render whatever child route matched. Outlet is the
  // placeholder React Router fills with the matched child element.
  return <Outlet />;
}

export default ProtectedRoute;
