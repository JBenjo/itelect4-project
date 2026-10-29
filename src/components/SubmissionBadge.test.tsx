// ===== SESSION 12: a NEW file =========================================
// ===== no Session 11 version -- nothing to compare it to ==============
// Test 1 of 3: a component render. The test sits beside the file it
// tests and has the same name with .test in front of .tsx.
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SubmissionBadge from "./SubmissionBadge";
import type { ApiSubmission } from "../types/index";

// One submission shaped exactly like a row from GET /api/submissions.
// Typed, so a field that does not exist in ApiSubmission is a compile
// error here too.
const graded: ApiSubmission = {
  id: "665f1c2ab4e8d3a1f0c9e101",
  studentId: "665f1c2ab4e8d3a1f0c9e001",
  courseCode: "ITELECT4",
  repoUrl: "https://github.com/juan/itelect4-project",
  submittedAt: "2026-10-17T02:15:00.000Z",
  score: 95,
};

describe("SubmissionBadge", () => {
  it("shows the repo link and the score", () => {
    render(<SubmissionBadge submission={graded} />);

    // The URL is inside the anchor, so it is found as a link whose
    // words a person would read on the page.
    expect(
      screen.getByRole("link", {
        name: "https://github.com/juan/itelect4-project",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Score: 95")).toBeInTheDocument();
  });

  it("says Pending when there is no score", () => {
    // Everything from graded, then score set to undefined -- the same
    // as a submission the instructor has not marked.
    const ungraded: ApiSubmission = { ...graded, score: undefined };

    render(<SubmissionBadge submission={ungraded} />);

    expect(screen.getByText("Score: Pending")).toBeInTheDocument();
    // The graded text must NOT be on the page for an ungraded row.
    expect(screen.queryByText("Score: 95")).not.toBeInTheDocument();
  });
});
