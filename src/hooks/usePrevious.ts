import { useRef, useEffect } from "react";

// Generic T — works for any state type (string, number, User, etc.)
//
// Returns the value the prop had on the PREVIOUS render, undefined on
// the very first one. How it works: the effect runs AFTER every
// render, so ref.current still holds last render's value when the
// component reads it, and is only then overwritten with the new one.
function usePrevious<T>(value: T): T | undefined {
  // useRef: a box React keeps between renders without re-rendering
  // the component when its contents change.
  const ref = useRef<T | undefined>(undefined);

  // No cleanup function, so nothing runs on unmount: the last value
  // simply stays in the ref.
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Read, not write: this is the value from before this render.
  return ref.current;
}

export default usePrevious;
