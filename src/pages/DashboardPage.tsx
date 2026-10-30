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

  // One handler for the card's button. Two things happen on a click:
  //   1. the chosen user is stored in state (so the card can highlight
  //      itself and the info panel can print their details), and
  //   2. the panel is opened -- but only if it is currently closed, so
  //      clicking Select twice does not close it again.
  const handleSelect = (user: User): void => {
    setSelectedUser(user);
    if (!showDetails) {
      toggleDetails();
    }
  };

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
          lg. Only the sample student for now. isSelected is what the
          card uses to show the ring and the "Selected" label. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UserCard
          user={student}
          onSelect={handleSelect}
          isSelected={selectedUser?.id === student.id}
        />
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
        <div className="surface max-w-xl rounded-2xl border p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Selected user
          </p>

          {/* A definition list: each row is a label and its value.
              grid-cols-[auto_1fr] puts the labels in one column and
              the values in the other, so they line up. */}
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-semibold text-foreground">
              {selectedUser.name}
            </dd>

            <dt className="text-muted-foreground">Email</dt>
            <dd className="text-foreground">{selectedUser.email}</dd>

            <dt className="text-muted-foreground">Role</dt>
            <dd className="capitalize text-foreground">
              {selectedUser.role}
            </dd>

            <dt className="text-muted-foreground">Status</dt>
            <dd className="text-foreground">
              {selectedUser.isActive ? "Active" : "Inactive"}
            </dd>

            <dt className="text-muted-foreground">User ID</dt>
            <dd className="font-mono text-foreground">{selectedUser.id}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
