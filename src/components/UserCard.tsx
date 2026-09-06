import type { User } from "../types";

interface UserCardProps {
  user: User;
  onSelect: (user: User) => void;
}

const UserCard = ({ user, onSelect }: UserCardProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    onSelect(user);
  };

  return (
    <div className="surface rounded-2xl border p-6">
      <div className="mb-5 flex items-start justify-between">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          Profile
        </span>
        <span className="size-3 rounded-full bg-emerald-500" title="Active" />
      </div>
      <h3 className="text-xl font-bold text-foreground">
        {user.name}
      </h3>
      <p className="mt-1 text-muted-foreground">{user.email}</p>
      <p className="mt-5 text-sm text-muted-foreground">
        Role: {user.role}
      </p>
      <p className="text-sm text-muted-foreground">
        Status: {user.isActive ? "Active" : "Inactive"}
      </p>
      <button
        onClick={handleClick}
        className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
      >
        Select User
      </button>
    </div>
  );
};

export default UserCard;