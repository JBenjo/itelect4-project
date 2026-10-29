// A tiny presentational component: it only receives props and prints
// them, with no state and no side effects. It exists to demonstrate
// typed props (GreetingProps) and conditional rendering.
import type { GreetingProps } from "../types";

const Greetings = ({ name, age }: GreetingProps) => {
  return (
    <section>
      {/* name is required, so it is always shown. */}
      <h2>Hello, {name}!</h2>
      {/* age is optional: the paragraph is only rendered when it was
          actually passed -- undefined would print nothing useful. */}
      {age !== undefined && <p>Age: {age}</p>}
    </section>
  );
};

export default Greetings;
