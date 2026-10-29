// The validation rules for the "add a submission" form, written once
// as Zod schema. react-hook-form runs it through zodResolver on every
// check, and the strings below are the exact messages shown to the
// student under the field.
import { z } from "zod";

export const submissionSchema = z.object({
  // A course must be picked; "" (the <select>'s empty option) fails.
  courseCode: z.string().min(1, "Choose a course."),

  // Two rules chained: it must be a real URL at all, and it must be a
  // GitHub URL, because submissions are graded from the repository.
  // .url() produces its own message when this one fails, so the custom
  // sentence covers only the second rule.
  repoUrl: z
    .url("That is not a valid URL - include https://")
    .refine(
      (url) => url.includes("github.com"),
      "It has to be a GitHub URL.",
    ),
});

// z.infer turns the schema into a TypeScript type, so the form's
// values and the schema can never drift apart: change one, the other
// type changes with it.
export type SubmissionFormValues = z.infer<typeof submissionSchema>;
