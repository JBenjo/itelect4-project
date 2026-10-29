// One submission rendered as a card: course, repository link, score.
// It is a pure display component -- no fetching, no state. Everything
// it shows comes from the submission prop, which is why the same card
// works in the list and in tests with hand-written sample data.
import type { ApiSubmission } from "../types";

interface SubmissionBadgeProps {
  submission: ApiSubmission;
  // Optional: when the parent passes it, the card shows a button that
  // calls it (used by SubmissionsPage for "View Details").
  onViewDetails?: () => void;
  // The button's text, passed as JSX children from the parent.
  children?: React.ReactNode;
}

const SubmissionBadge: React.FC<SubmissionBadgeProps> = ({
  submission,
  onViewDetails,
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
        {/* The URL doubles as the link's label; target="_blank" opens
            it in a new tab, and rel="noopener noreferrer" blocks the
            classic reverse-tabnabbing window.opener exploit. */}
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
        {/* score is number | undefined in ApiSubmission: ?? prints the
            word "Pending" instead of an empty gap until the instructor
            grades it. */}
        Score: {submission.score ?? "Pending"}
      </p>
      {/* Two ways to render the parent's extra content: as a button
          when there is something to click, or plain when there is not.
          && short-circuits, so neither block runs without children. */}
      {children && onViewDetails && (
        <button
          type="button"
          onClick={onViewDetails}
          className="mt-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {children}
        </button>
      )}
      {children && !onViewDetails && (
        <div className="mt-2">{children}</div>
      )}
    </div>
  );
};

export default SubmissionBadge;
