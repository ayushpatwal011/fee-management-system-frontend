import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { api } from "@/api";

// 🔹 Course Type (same as backend)
export interface Course {
  courseId: number;
  courseName: string;
  semester: number;
  feeAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

// 🔹 Zustand Store Interface
interface CourseStore {
  courses: Course[];
  coursesCount: number;
  totalFee: number;
  loading: boolean;

  fetchCourses: () => Promise<void>;
  getCourseById: (id: number) => Promise<Course | null>;
  addCourse: (data: Omit<Course, "courseId">) => Promise<void>;
  updateCourse: (id: number, data: Partial<Course>) => Promise<void>;
  deleteCourse: (id: number) => Promise<void>;
}

// 🔹 API Base URL
 

export const useCoursesStore = create<CourseStore>((set, get) => ({
  courses: [],
  coursesCount: 0,
  totalFee: 0,
  loading: false,

  // 🟢 Fetch all courses
  fetchCourses: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${ api}/courses`);
      const courses = res.data.data || res.data;

      const totalFee = courses.reduce(
        (sum: number, c: Course) => sum + (c.feeAmount || 0),
        0
      );

      set({
        courses,
        coursesCount: courses.length,
        totalFee,
        loading: false,
      });
    } catch (err: any) {
      set({ loading: false });
      console.error("Error fetching courses:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch courses");
    }
  },

  // 🔵 Get single course
  getCourseById: async (id) => {
    try {
      const res = await axios.get(`${ api}/courses/${id}`);
      return res.data.data || res.data;
    } catch (err: any) {
      console.error("Error fetching course:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch course");
      return null;
    }
  },

  // 🟡 Add new course
  addCourse: async (data) => {
    try {
      const res = await axios.post(`${ api}/courses`, data);
      const newCourse = res.data.data || res.data;

      const updatedCourses = [...get().courses, newCourse];
      const updatedTotal = updatedCourses.reduce(
        (sum, c) => sum + (c.feeAmount || 0),
        0
      );

      set({
        courses: updatedCourses,
        coursesCount: updatedCourses.length,
        totalFee: updatedTotal,
      });
    } catch (err: any) {
      console.error("Error adding course:", err);
      toast.error(err?.response?.data?.message || "Failed to add course");
    }
  },

  // 🟠 Update existing course
  updateCourse: async (id, data) => {
    try {
      const res = await axios.put(`${ api}/courses/${id}`, data);
      const updated = res.data.data;

      set((state) => ({
        courses: state.courses.map((c) =>
          c.courseId === updated.courseId ? updated : c
        ),
      }));

      toast.success(res.data.message || "Course updated successfully!");
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || "Failed to update course");
      throw error;
    }
  },

  // 🔴 Delete course
  deleteCourse: async (id) => {
    try {
      await axios.delete(`${ api}/courses/${id}`);
      const updatedCourses = get().courses.filter((c) => c.courseId !== id);
      const updatedTotal = updatedCourses.reduce(
        (sum, c) => sum + (c.feeAmount || 0),
        0
      );

      set({
        courses: updatedCourses,
        coursesCount: updatedCourses.length,
        totalFee: updatedTotal,
      });
      toast.success("Course deleted successfully");
    } catch (err: any) {
      console.error("Error deleting course:", err);
      toast.error(err?.response?.data?.message || "Failed to delete course");
    }
  },
}));
