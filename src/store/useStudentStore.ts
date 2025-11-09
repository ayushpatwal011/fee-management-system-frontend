import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { useCoursesStore } from "./useCoursesStore";

const API_URL = "https://fees-management-system-springboot-8.onrender.com/api";

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
  totalFee: number; // ✅ new
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
  totalFee: 0, // ✅ added
  loading: false,

  // 🟢 Fetch all students
  fetchStudents: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${API_URL}/students`);
      let data = res.data.data || res.data;

      // 🔹 Get all courses from course store
      const { courses } = useCoursesStore.getState();

      // 🔹 Attach course names
      data = data.map((student: Student) => {
        const course = courses.find((c) => c.courseId === student.courseId);
        return {
          ...student,
          courseName: course ? course.courseName : "Unknown",
        };
      });

      // 🔹 Total Paid Fees
      const totalPaidFee = data.reduce(
        (sum: number, s: Student) => sum + (s.paidFee || 0),
        0
      );

      // 🔹 Calculate total course fees = Σ(course.feeAmount × number of students in it)
      const courseFeeMap = new Map<number, { feeAmount: number; count: number }>();

      // Count students per course
      for (const s of data) {
        const course = courses.find((c) => c.courseId === s.courseId);
        if (course) {
          if (!courseFeeMap.has(course.courseId)) {
            courseFeeMap.set(course.courseId, { feeAmount: course.feeAmount, count: 1 });
          } else {
            const current = courseFeeMap.get(course.courseId)!;
            current.count += 1;
            courseFeeMap.set(course.courseId, current);
          }
        }
      }

      // Sum total fee
      let totalFee = 0;
      for (const [, value] of courseFeeMap.entries()) {
        totalFee += value.feeAmount * value.count;
      }

      set({
        students: data,
        studentCount: data.length,
        totalPaidFee,
        totalFee, // ✅ updated correctly
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

      const { courses } = useCoursesStore.getState();
      const course = courses.find((c) => c.courseId === newStudent.courseId);
      newStudent.courseName = course ? course.courseName : "Unknown";

      set((state) => {
        const updatedStudents = [...state.students, newStudent];
        return {
          students: updatedStudents,
          studentCount: updatedStudents.length,
          loading: false,
        };
      });

      toast.success("Student added successfully!");
      // ✅ Refresh students to recalc totalFee correctly
      get().fetchStudents();
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
      const course = courses.find((c) => c.courseId === updatedData.courseId);
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

      // ✅ Refresh to keep totals accurate
      get().fetchStudents();

      toast.success(res.data.message || "Student updated successfully!");
    } catch (error: any) {
      set({ loading: false });
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || "Failed to update student");
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

      // ✅ Recalculate total fees again
      get().fetchStudents();

      toast.success("Student deleted successfully");
    } catch (err: any) {
      set({ loading: false });
      console.error("Error deleting student:", err);
      toast.error(err?.response?.data?.message || "Failed to delete student");
    }
  },
}));
