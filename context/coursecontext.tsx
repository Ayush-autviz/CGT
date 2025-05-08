"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CourseContextType {
  selectedCourseId: string | null;
  setSelectedCourseId: (courseId: string | null) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  return (
    <CourseContext.Provider value={{ selectedCourseId, setSelectedCourseId }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
}