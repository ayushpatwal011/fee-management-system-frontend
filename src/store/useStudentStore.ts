import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { useCoursesStore } from "./useCoursesStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export interface Student {
  studentId: number;
  fullName: string;
  rollNo: string;
  contactNo: string;
  parentName: string;
  courseId: number;
  courseName?: string;
  totalFee?: number;
  paidFee?: number;
  pendingFee?: number;
  admissionDate?: string;
  lastPaymentDate?: string;
}

interface StudentStore {
  students: Student[];
  studentCount: number;
  totalPaidFee: number;
  loading: boolean;

  fetchStudents: () => Promise<void>;
  addStudent: (data: Omit<Student, "studentId">) => Promise<void>;
  updateStudent: (id: number, data: Partial<Student>) => Promise<void>;
  deleteStudent: (id: number) => Promise<void>;
}

export const useStudentStore = create<StudentStore>((set, get) => ({
  students: [],
  studentCount: 0,
  totalPaidFee: 0,
  loading: false,

  // 🟢 Fetch all students
  fetchStudents: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${API_URL}/students`);
      let data = res.data.data || res.data;

      // 🔹 Get all courses from course store
      const { courses } = useCoursesStore.getState();

      // 🔹 Add courseName for each student
      data = data.map((student: Student) => {
        const course = courses.find((c) => c.courseId === student.courseId);
        return {
          ...student,
          courseName: course ? course.courseName : "Unknown",
        };
      });

      const totalPaidFee = data.reduce(
        (sum: number, s: Student) => sum + (s.paidFee || 0),
        0
      );

      set({
        students: data,
        studentCount: data.length,
        totalPaidFee,
        loading: false,
      });
    } catch (err: any) {
      set({ loading: false });
      console.error("Error fetching students:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch students");
    }
  },

  // 🟡 Add new student
  addStudent: async (data) => {
    try {
      set({ loading: true });
      const res = await axios.post(`${API_URL}/students`, data);
      let newStudent = res.data.data || res.data;

      // Add course name using course store
      const { courses } = useCoursesStore.getState();
      const course = courses.find((c) => c.courseId === newStudent.courseId);
      newStudent.courseName = course ? course.courseName : "Unknown";

      set((state) => ({
        students: [...state.students, newStudent],
        studentCount: state.studentCount + 1,
        loading: false,
      }));

      // toast.success("Student added successfully!");
    } catch (err: any) {
      set({ loading: false });
      console.error("Error adding student:", err);
      toast.error(err?.response?.data?.message || "Failed to add student");
    }
  },

  // 🟠 Update student
  updateStudent: async (id, data) => {
    try {
      set({ loading: true });
      const res = await axios.put(`${API_URL}/students/${id}`, data);
      const updatedData = res.data.data || res.data;

      const { courses } = useCoursesStore.getState();

      if (Array.isArray(updatedData)) {
        // Backend returned full list
        const enriched = updatedData.map((s) => {
          const course = courses.find((c) => c.courseId === s.courseId);
          return { ...s, courseName: course ? course.courseName : "Unknown" };
        });

        const totalPaidFee = enriched.reduce(
          (sum, s) => sum + (s.paidFee || 0),
          0
        );

        set({
          students: enriched,
          studentCount: enriched.length,
          totalPaidFee,
          loading: false,
        });
      } else {
        // Backend returned single student
        const course = courses.find(
          (c) => c.courseId === updatedData.courseId
        );
        const updatedStudent = {
          ...updatedData,
          courseName: course ? course.courseName : "Unknown",
        };

        set((state) => ({
          students: state.students.map((s) =>
            s.studentId === updatedStudent.studentId ? updatedStudent : s
          ),
          loading: false,
        }));
      }

      toast.success(res.data.message || "Student updated successfully!");
    } catch (error: any) {
      set({ loading: false });
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || "Failed to update student");
      throw error;
    }
  },

  // 🔴 Delete student
  deleteStudent: async (id) => {
    try {
      set({ loading: true });
      await axios.delete(`${API_URL}/students/${id}`);

      const updatedList = get().students.filter((s) => s.studentId !== id);
      const totalPaidFee = updatedList.reduce(
        (sum, s) => sum + (s.paidFee || 0),
        0
      );

      set({
        students: updatedList,
        studentCount: updatedList.length,
        totalPaidFee,
        loading: false,
      });
      toast.success("Student deleted successfully");
    } catch (err: any) {
      set({ loading: false });
      console.error("Error deleting student:", err);
      toast.error(err?.response?.data?.message || "Failed to delete student");
    }
  },
}));
