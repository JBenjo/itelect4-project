// One course as a card. The same component is used in two sizes:
// "default" (the full card) and "compact" (a smaller tile), chosen by
// the variant prop -- one source of truth for how a course looks.
import type { Course } from "../types";

interface CourseCardProps {
  course: Course;
  // Optional, so callers that say nothing get the full card.
  variant?: "default" | "compact";
}

const CourseCard = ({ course, variant = "default" }: CourseCardProps) => {
  // Turn the variant into a single boolean the JSX below can branch on.
  const isCompact = variant === "compact";

  return (
    // surface: the project's shared card background. The two
    // conditional Tailwind classes change padding and font size only
    // when compact is true; hover lifts the card slightly.
    <div
      className={`surface rounded-2xl border transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
        isCompact ? "p-3" : "p-5"
      }`}
    >
      <h3
        className={`font-bold text-foreground ${
          isCompact ? "text-sm" : "text-lg"
        }`}
      >
        {/* The course code is always shown, in both variants. */}
        {course.code}
      </h3>
      {/* The title is dropped in compact mode to keep the tile short. */}
      {!isCompact && (
        <p className="text-muted-foreground">{course.title}</p>
      )}
      <p className="text-sm text-muted-foreground">
        {course.units} units - {course.semester}
      </p>
    </div>
  );
};

export default CourseCard;
