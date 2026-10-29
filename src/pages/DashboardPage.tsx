// The landing page. It demonstrates the two ways this app holds state:
// useState for the selected user (a value that changes and re-renders)
// and the custom useToggle hook for the details panel (true/false).
import { useState } from "react";
import type { User } from "../types/index";
import UserCard from "../components/UserCard";
import useToggle from "../hooks/useToggle";
import { student } from "../data/mockData";

function DashboardPage() {
  // null = nothing chosen yet. setUserCard's onSelect writes it here,
  // so the choice lives in this page, not in UserCard.
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // useToggle returns [value, toggle]: false at first, and every
  // press of the button below flips it.
  const [showDetails, toggleDetails] = useToggle(false);

  return (
    <div className="space-y-8">
      {/* Header block: an eyebrow line, the heading, then one sentence
          of supporting copy. */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Student workspace
        </p>
        <h2 className="page-heading text-4xl font-bold text-foreground">
          Dashboard
        </h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Keep your course activity and submissions in one calm, focused place.
        </p>
      </div>

      {/* Responsive grid: one column on phones, two from sm, three from
          lg. Only the sample student for now. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UserCard user={student} onSelect={setSelectedUser} />
      </div>

      {/* The toggle: its label changes with the state it controls. */}
      <button
        onClick={toggleDetails}
        className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-muted"
      >
        {showDetails ? "Hide" : "Show"} Details
      </button>

      {/* Both conditions must hold: the panel is open AND a user was
          picked. && short-circuits, so no null.name can throw. */}
      {showDetails && selectedUser !== null && (
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          Selected: {selectedUser.name} ({selectedUser.role})
        </p>
      )}
    </div>
  );
}

export default DashboardPage;
