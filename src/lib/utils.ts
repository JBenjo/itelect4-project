// One helper, copied from the shadcn/ui starter: cn() builds a
// className string out of conditional class names.
//
//   cn("px-2", isActive && "bg-blue-500", className)
//
// clsx turns the arguments (strings, falsy values, objects) into one
// class string; twMerge then resolves conflicts between Tailwind
// utilities, so "px-2 px-6" comes out as "px-6" -- the last one wins
// instead of both fighting in the stylesheet.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
