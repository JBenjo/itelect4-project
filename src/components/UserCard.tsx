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
    <section style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", margin: "1rem 0" }}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
      <p>Status: {user.isActive ? "Active" : "Inactive"}</p>
      <button onClick={handleClick}>Select User</button>
    </section>
  );
};

export default UserCard;