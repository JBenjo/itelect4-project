import type { GreetingProps } from "../types";

const Greetings = ({ name, age }: GreetingProps) => {
  return (
    <section>
      <h2>Hello, {name}!</h2>
      {age !== undefined && <p>Age: {age}</p>}
    </section>
  );
};

export default Greetings;
