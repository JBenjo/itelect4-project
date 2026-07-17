import React from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin";
}

interface GreetingProps {
  name: string;
  age?: number;
}

const Greeting: React.FC<GreetingProps> = ({ name, age }) => {
  return (
    <div>
      <h2>Hello, {name}!</h2>
      {age !== undefined && <p>Age: {age}</p>}
    </div>
  );
};

const UserCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <section>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
    </section>
  );
};

const App: React.FC = () => {
  const student: User = {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juan@example.com",
    role: "student",
  };

  return (
    <div>
      <Greeting name="ITELECT4" age={20} />
      <UserCard user={student} />
    </div>
  );
};

export default App;
