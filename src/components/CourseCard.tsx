import type { Course } from "../types";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <section style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", margin: "1rem 0" }}>
      <h3>{course.code}</h3>
      <p>{course.title}</p>
      <p>{course.units} units - {course.semester}</p>
    </section>
  );
};

export default CourseCard;