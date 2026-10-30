// src/pages/ReviewPage.tsx
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";

import type { AiReview, Course } from "../types/index";
import { askAi, fetchCourses } from "../api/client";
import { reviewFormSchema, type ReviewFormValues } from "../schemas/reviewSchema";
import useAuthStore from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const READINESS_META: Record<
  AiReview["readiness"],
  { label: string; badgeClass: string; description: string }
> = {
  ready: {
    label: "Ready to Submit",
    badgeClass:
      "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700",
    description: "Your project meets the key course requirements. You can submit your repository now.",
  },
  almost: {
    label: "Almost Ready",
    badgeClass:
      "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700",
    description: "Minor details or documentation are missing. Check the suggested improvements below.",
  },
  "not-yet": {
    label: "Needs Work",
    badgeClass:
      "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-700",
    description: "The description is either too brief or major components are missing.",
  },
};

const TEMPLATES: Record<string, string> = {
  ITELECT4: `Course: ITELECT4 (Web Development)
Project Title: Submission Tracker
Tech Stack: React, TypeScript, Tailwind CSS, Express, MongoDB
Key Features: User authentication with JWT, protected routes, course browsing, and GitHub submission management.
Deployment & Repo: Frontend and backend deployed on Vercel; includes a GitHub README with setup instructions.`,

  CSSWENG: `Course: CSSWENG (Software Engineering)
Project Title: Team Project Tracker
Tech Stack: React, Vite, Node.js, Express, MongoDB
Key Features: Agile task tracking, user role management, and sprint backlog management.
Deployment & Repo: Deployed live with GitHub Actions CI pipeline and comprehensive unit tests.`,

  ITELECT3: `Course: ITELECT3 (IT Elective 3)
Project Title: Cloud Information System
Tech Stack: TypeScript, RESTful API, MongoDB
Key Features: CRUD records management, search & filtering, secure token-based access.
Deployment & Repo: Live production API deployment and complete API documentation in README.`,
};

export default function ReviewPage() {
  const navigate = useNavigate();
  const { logout, userName } = useAuthStore();
  const [selectedCourse, setSelectedCourse] = useState<string>("ITELECT4");

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { prompt: "" },
  });

  const promptValue = watch("prompt") || "";

  const review = useMutation({
    mutationFn: askAi,
  });

  const onSubmit = (values: ReviewFormValues): void => {
    review.mutate(values.prompt);
  };

  const applyTemplate = (courseCode: string) => {
    setSelectedCourse(courseCode);
    const template = TEMPLATES[courseCode] || TEMPLATES.ITELECT4;
    setValue("prompt", template, { shouldValidate: true });
  };

  const isTokenError =
    review.isError &&
    (review.error.message.toLowerCase().includes("token") ||
      review.error.message.toLowerCase().includes("401"));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Submission Tracker • Pre-Submission Review
        </p>
        <h1 className="page-heading text-4xl font-bold text-foreground">
          AI Project Review
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Welcome{userName ? `, ${userName}` : ""}! Before submitting your repository to the tracker,
          use this tool to evaluate whether your project meets course requirements (tech stack,
          authentication, database, and deployment).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Review Form */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="surface rounded-2xl border p-6 space-y-5"
          >
            {/* Template Quick Selection */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <Label htmlFor="prompt" className="text-sm font-semibold text-foreground">
                  Project Description
                </Label>
                <span className="text-xs text-muted-foreground">
                  {promptValue.length} / 2000 chars (min 20)
                </span>
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">
                  Load starter template:
                </span>
                {(courses && courses.length > 0
                  ? courses.map((c) => c.code)
                  : ["ITELECT4", "CSSWENG", "ITELECT3"]
                ).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => applyTemplate(code)}
                    className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                      selectedCourse === code
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {code} Template
                  </button>
                ))}
                {promptValue.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setValue("prompt", "", { shouldValidate: true })}
                    className="text-xs text-muted-foreground hover:text-foreground underline ml-auto"
                  >
                    Clear text
                  </button>
                )}
              </div>

              <textarea
                id="prompt"
                rows={8}
                {...register("prompt")}
                aria-invalid={errors.prompt ? true : undefined}
                placeholder="Describe what you built for your course: your tech stack, key features, database models, user authentication, and where it is deployed..."
                className="w-full rounded-xl border border-input bg-background p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.prompt && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {errors.prompt.message}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <Button
                type="submit"
                disabled={review.isPending}
                className="min-w-[170px]"
              >
                {review.isPending ? "Analyzing Project..." : "Review My Project"}
              </Button>

              <span className="text-xs text-muted-foreground">
                Evaluates code readiness, deployment & README
              </span>
            </div>
          </form>

          {/* Session Expiry or API Error Alert */}
          {review.isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <strong className="block font-semibold">
                    {isTokenError ? "Session Expired" : "Review Request Failed"}
                  </strong>
                  <p className="mt-1 text-xs">
                    {isTokenError
                      ? "Your login session has expired. Please sign in again to generate a new token."
                      : review.error.message}
                  </p>
                </div>
                {isTokenError && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="shrink-0 text-xs"
                  >
                    Log In Again
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Review Results */}
          {review.data && (
            <div className="surface rounded-2xl border p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Project Readiness Assessment
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {READINESS_META[review.data.readiness].description}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    READINESS_META[review.data.readiness].badgeClass
                  }`}
                >
                  {READINESS_META[review.data.readiness].label}
                </span>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Overview
                </h4>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {review.data.summary}
                </p>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Strengths & Good Practices
                </h4>
                <ul className="mt-2 space-y-2">
                  {review.data.strengths.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-foreground/90"
                    >
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Checklist Before Submitting
                </h4>
                <ul className="mt-2 space-y-2">
                  {review.data.improvements.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-foreground/90"
                    >
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-400">
                        →
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Step Action */}
              {(review.data.readiness === "ready" ||
                review.data.readiness === "almost") && (
                <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs text-muted-foreground">
                    Satisfied with your project readiness? Head over to submit your repository URL.
                  </p>
                  <Button
                    onClick={() => navigate("/submissions")}
                    className="w-full sm:w-auto"
                  >
                    Go to Submissions &rarr;
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Guide */}
        <div className="space-y-6">
          <div className="surface rounded-2xl border p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              What the AI Evaluates
            </h3>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-primary">01</span>
                <div>
                  <strong className="block text-foreground font-semibold">
                    Course & Architecture
                  </strong>
                  Which course (ITELECT4, CSSWENG) and your tech stack (React, TypeScript, Express, MongoDB).
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-primary">02</span>
                <div>
                  <strong className="block text-foreground font-semibold">
                    Core Functionality
                  </strong>
                  Student login/JWT, protected data routes, and course submission tracking.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-primary">03</span>
                <div>
                  <strong className="block text-foreground font-semibold">
                    Deployment Status
                  </strong>
                  Live frontend and backend URLs (e.g. Vercel, Render) with valid HTTPS.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-primary">04</span>
                <div>
                  <strong className="block text-foreground font-semibold">
                    GitHub Repository
                  </strong>
                  Public repository link with a comprehensive README detailing setup steps.
                </div>
              </li>
            </ul>
          </div>

          <div className="surface rounded-2xl border p-5 text-xs text-muted-foreground space-y-2">
            <strong className="block text-foreground font-semibold">
              Tip for Students
            </strong>
            <p>
              The AI does not access your code directly—it checks the completeness of your project
              specification and repository readiness. Use the starter templates above to format your
              description accurately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
