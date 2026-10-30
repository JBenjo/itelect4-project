// A user shown as a profile card, with a button that hands the whole
// user object back to whoever rendered the card. It is controlled:
// this component never decides what happens after a click -- the
// parent passes onSelect and does that itself.
import type { User } from "../types";

interface UserCardProps {
  user: User;
  // Called with this card's user when "Select User" is pressed.
  onSelect: (user: User) => void;
  // Optional, and also controlled by the parent: true means THIS card
  // is the one currently selected, so it draws a ring and says so.
  isSelected?: boolean;
}

const UserCard = ({ user, onSelect, isSelected = false }: UserCardProps) => {
  // e.preventDefault() guards against the button sitting inside a
  // <form>: without it the browser would also submit that form. Then
  // pass this user up to the parent.
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    onSelect(user);
  };

  return (
    // The outline and tint only appear while isSelected is true. An
    // outline is used instead of a ring because .surface in index.css
    // already sets box-shadow, and a ring is also a box-shadow -- the
    // plain CSS class would win and the highlight would be invisible.
    // (border-primary is avoided for the same reason: the `*` rule in
    // index.css sets border-color and beats every utility.)
    <div
      className={`surface rounded-2xl border p-6 transition ${
        isSelected
          ? "bg-primary/10 outline-2 outline-offset-2 outline-primary"
          : ""
      }`}
    >
      <div className="mb-5 flex items-start justify-between">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          {isSelected ? "Selected" : "Profile"}
        </span>
        {/* Green dot = active account; the title attribute explains it
            on hover for anyone who cannot rely on the colour. */}
        <span className="size-3 rounded-full bg-emerald-500" title="Active" />
      </div>
      <h3 className="text-xl font-bold text-foreground">
        {user.name}
      </h3>
      <p className="mt-1 text-muted-foreground">{user.email}</p>
      <p className="mt-5 text-sm text-muted-foreground">
        Role: {user.role}
      </p>
      {/* isActive is a boolean in the type, so it is translated into
          the word a person reads on the screen. */}
      <p className="text-sm text-muted-foreground">
        Status: {user.isActive ? "Active" : "Inactive"}
      </p>
      {/* aria-pressed tells a screen reader this is a toggle button and
          whether it is currently on -- the visual change alone would
          not reach someone who cannot see the ring. */}
      <button
        onClick={handleClick}
        aria-pressed={isSelected}
        className={`mt-5 rounded-lg px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${
          isSelected
            ? "border border-primary bg-primary/10 text-primary"
            : "bg-primary text-primary-foreground hover:opacity-90"
        }`}
      >
        {isSelected ? "Selected" : "Select User"}
      </button>
    </div>
  );
};

export default UserCard;
