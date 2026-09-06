import type { ApiSubmission } from "../types";

interface SubmissionBadgeProps {
  submission: ApiSubmission;
  children?: React.ReactNode;
}

const SubmissionBadge: React.FC<SubmissionBadgeProps> = ({
  submission,
  children,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        Submission Details
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        Course: {submission.courseCode}
      </p>
      <p className="text-gray-600 dark:text-gray-300">
        Repository:{" "}
        <a
          href={submission.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          {submission.repoUrl}
        </a>
      </p>
      <p className="text-gray-600 dark:text-gray-300">
        Score: {submission.score ?? "Pending"}
      </p>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default SubmissionBadge;