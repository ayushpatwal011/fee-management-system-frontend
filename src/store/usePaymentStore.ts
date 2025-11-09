import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { api } from "@/api";

// 🔹 Payment type
export interface Payment {
  paymentId: number;
  studentId: number;
  studentName?: string;
  courseName?: string;
  amountPaid: number;
  totalFee?: number;
  paidPercentage?: number;
  paymentMode: string;
  remarks?: string;
  paymentDate?: string; // ✅ optional, backend sets this
}

// 🔹 Chart data
export interface DailyFee {
  date: string;
  fees: number;
}

interface PaymentStore {
  payments: Payment[];
  latestPayments: Payment[];
  totalPaidAmount: number;
  dailyFeesData: DailyFee[];
  loading: boolean;

  fetchPayments: () => Promise<void>;
  createPayment: (
    data: Omit<Payment, "paymentId" | "studentName" | "courseName" | "paymentDate">
  ) => Promise<void>;
  getPaymentsByStudent: (studentId: number) => Promise<Payment[] | null>;
}

 ;

// 🔹 Helper for safe date conversion
const safeDate = (date?: string) => (date ? new Date(date) : new Date(0));

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  payments: [],
  latestPayments: [],
  totalPaidAmount: 0,
  dailyFeesData: [],
  loading: false,

  // 🟢 Fetch all payments
  fetchPayments: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${ api}/payments`);
      const payments: Payment[] = res.data.data || [];

      // ✅ Enrich each payment with student & course info
      const enrichedPayments = await Promise.all(
        payments.map(async (p) => {
          try {
            const studentRes = await axios.get(`${ api}/students/${p.studentId}`);
            const student = studentRes.data.data || studentRes.data;

            const courseRes = await axios.get(`${ api}/courses/${student.courseId}`);
            const course = courseRes.data.data || courseRes.data;

            const totalFee = course.feeAmount;
            const paidPercentage = Math.round((p.amountPaid / totalFee) * 100);

            return {
              ...p,
              studentName: student.fullName,
              courseName: course.courseName,
              totalFee,
              paidPercentage,
            };
          } catch {
            return {
              ...p,
              studentName: "Unknown",
              courseName: "Unknown",
              paidPercentage: 0,
            };
          }
        })
      );

      // ✅ Totals & sorting
      const totalPaidAmount = enrichedPayments.reduce(
        (sum, p) => sum + (p.amountPaid || 0),
        0
      );

      const sorted = enrichedPayments.sort(
        (a, b) => safeDate(b.paymentDate).getTime() - safeDate(a.paymentDate).getTime()
      );

      const latestPayments = sorted.slice(0, 3);
      const dailyFeesData = generateLast10DaysData(enrichedPayments);

      set({
        payments: enrichedPayments,
        latestPayments,
        totalPaidAmount,
        dailyFeesData,
        loading: false,
      });
    } catch (err: any) {
      set({ loading: false });
      console.error("Error fetching payments:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch payments");
    }
  },

  // 🔵 Get payments by student
  getPaymentsByStudent: async (studentId) => {
    try {
      const res = await axios.get(`${ api}/payments/student/${studentId}`);
      const payments = res.data.data || [];

      const studentRes = await axios.get(`${ api}/students/${studentId}`);
      const student = studentRes.data.data || studentRes.data;

      const courseRes = await axios.get(`${ api}/courses/${student.courseId}`);
      const course = courseRes.data.data || courseRes.data;

      return payments.map((p: Payment) => ({
        ...p,
        studentName: student.fullName,
        courseName: course.courseName,
        totalFee: course.feeAmount,
        paidPercentage: Math.round((p.amountPaid / course.feeAmount) * 100),
      }));
    } catch (err: any) {
      console.error("Error fetching student payments:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch student payments");
      return null;
    }
  },

  // 🟡 Create new payment
  createPayment: async (data) => {
    try {
      const res = await axios.post(`${ api}/payments`, data);
      const newPayment: Payment = res.data.data || res.data;

      // ✅ Fetch related student & course info
      const studentRes = await axios.get(`${ api}/students/${data.studentId}`);
      const student = studentRes.data.data || studentRes.data;

      const courseRes = await axios.get(`${ api}/courses/${student.courseId}`);
      const course = courseRes.data.data || courseRes.data;

      const paymentWithMeta: Payment = {
        ...newPayment,
        studentName: student.fullName,
        courseName: course.courseName,
        totalFee: course.feeAmount,
        paidPercentage: Math.round((newPayment.amountPaid / course.feeAmount) * 100),
      };

      // ✅ Update payments state
      const updatedPayments = [...get().payments, paymentWithMeta];
      const totalPaidAmount = updatedPayments.reduce(
        (sum, p) => sum + (p.amountPaid || 0),
        0
      );

      const sorted = updatedPayments.sort(
        (a, b) => safeDate(b.paymentDate).getTime() - safeDate(a.paymentDate).getTime()
      );

      const latestPayments = sorted.slice(0, 3);
      const dailyFeesData = generateLast10DaysData(updatedPayments);

      set({
        payments: updatedPayments,
        totalPaidAmount,
        latestPayments,
        dailyFeesData,
      });

      // ✅ Refresh students immediately
      import("@/store/useStudentStore").then(({ useStudentStore }) => {
        useStudentStore.getState().fetchStudents();
      });

      // toast.success("Payment added successfully and student data updated!");
    } catch (err: any) {
      console.error("Error creating payment:", err);
      toast.error(err?.response?.data?.message || "Failed to add payment");
    }
  },
}));

// 🧮 Helper: Generate last 10 days chart data
function generateLast10DaysData(payments: Payment[]): DailyFee[] {
  const today = new Date();
  const last10Days: DailyFee[] = [];

  for (let i = 9; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    last10Days.push({ date: dateStr, fees: 0 });
  }

  for (const p of payments) {
    if (!p.paymentDate) continue;
    const dateStr = new Date(p.paymentDate ?? "").toISOString().split("T")[0];
    const day = last10Days.find((d) => d.date === dateStr);
    if (day) day.fees += p.amountPaid || 0;
  }

  return last10Days;
}
