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
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        {user.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Role: {user.role}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Status: {user.isActive ? "Active" : "Inactive"}
      </p>
      <button
        onClick={handleClick}
        className="mt-3 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Select User
      </button>
    </div>
  );
};

export default UserCard;