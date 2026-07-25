import type { Submission } from "../types";

interface SubmissionBadgeProps {
  submission: Submission;
  children?: React.ReactNode;
}

const SubmissionBadge: React.FC<SubmissionBadgeProps> = ({ submission, children }) => {
  return (
    <section style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", margin: "1rem 0", backgroundColor: "#f9f9f9" }}>
      <h3>Submission Details</h3>
      <p>Course: {submission.courseCode}</p>
      <p>Repository: <a href={submission.repoUrl} target="_blank" rel="noopener noreferrer">{submission.repoUrl}</a></p>
      <p>Score: {submission.score ?? "Pending"}</p>
      {children}
    </section>
  );
};

export default SubmissionBadge;