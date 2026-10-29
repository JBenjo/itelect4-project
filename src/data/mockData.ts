// A sample record used by the Session 1 examples and demos, shaped
// exactly like the User interface in src/types/index.ts -- so a typo
// in a field name here is a compile error, not a silent undefined.
import type { User } from "../types/index";

export const student: User = {
  id: 1,
  name: "Juan dela Cruz",
  email: "juan@example.com",
  role: "student",
  isActive: true,
};
