import { useState } from "react";

// A boolean on/off switch as a hook. It is used by the dashboard's
// details panel: false to start, and each call flips the value.
//
// How it works: useState holds the value across renders; toggle()
// never writes the next value directly -- it passes a function that
// receives the previous one, so two quick clicks cannot both read the
// same stale value and cancel each other out.
//
// Returns a tuple, not just the value: [current value, flip function].
function useToggle(initialValue: boolean): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = (): void => {
    setValue((prev) => !prev);
  };

  // The component re-renders whenever value changes, because this is
  // state -- unlike useRef, which would update silently.
  return [value, toggle];
}

export default useToggle;
