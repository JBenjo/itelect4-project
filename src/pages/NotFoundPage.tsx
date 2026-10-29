// Shown by the catch-all <Route path="*"> in App.tsx whenever the URL
// matches no other route. It is deliberately dumb: no data, no state,
// just a message and a way back into the app.
import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    // flex column, centered: the 404, the sentence and the button are
    // stacked and centered vertically with padding above and below.
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Page not found
      </p>
      {/* <Link> is React Router's anchor: it changes the URL without a
          full page reload, so going home keeps the app mounted. */}
      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
      >
        Go Home
      </Link>
    </div>
  );
}
