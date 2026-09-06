import type { Course } from "../types";

interface CourseCardProps {
  course: Course;
  variant?: "default" | "compact";
}

const CourseCard = ({ course, variant = "default" }: CourseCardProps) => {
  const isCompact = variant === "compact";

  return (
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
        {course.code}
      </h3>
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