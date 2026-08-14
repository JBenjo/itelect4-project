import SubmissionBadge from "../components/SubmissionBadge";
import { allSubmissions } from "../data/mockData";
import { useAuthStore } from "../store/authStore";

export default function SubmissionsPage() {
  const { userName } = useAuthStore();

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-2">My Submissions</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Welcome, {userName}!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allSubmissions.map((submission) => (
          <SubmissionBadge key={submission.id} submission={submission}>
            View Details
          </SubmissionBadge>
        ))}
      </div>

      {allSubmissions.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400 py-8">
          No submissions yet.
        </p>
      )}
    </div>
  );
}
