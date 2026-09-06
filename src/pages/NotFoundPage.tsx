import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Page not found
      </p>
      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
      >
        Go Home
      </Link>
    </div>
  );
}
