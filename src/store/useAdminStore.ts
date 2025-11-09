import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

interface Admin {
  id: number;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminStore {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateAdmin: (adminId: number, data: Partial<{ email: string; password: string }>) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL; 

export const useAdminStore = create<AdminStore>((set) => ({
  admin: JSON.parse(localStorage.getItem("admin") || "null"),

  // 🟢 Login
  login: async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/admin/login`, { email, password });
      const admin = res.data.data;  

      set({ admin });
      localStorage.setItem("admin", JSON.stringify(admin));
      toast.success("Admin login successful");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login failed");
    }
  },

  // 🔴 Logout
  logout: () => {
    set({ admin: null });
    localStorage.removeItem("admin");
    toast.success("Logout successful");
  },

  // 🟠 Update admin email or password
 updateAdmin: async (
  adminId: number,
  data: { email?: string; password?: string }
) => {
  try {
    const res = await axios.put(`${API_URL}/admin/update/${adminId}`, data);
    const updatedAdmin = res.data.data;

    set({ admin: updatedAdmin });
    localStorage.setItem("admin", JSON.stringify(updatedAdmin));
    toast.success("Admin updated successfully");
  } catch (error: any) {
    console.error("Error updating admin:", error);
    toast.error(error?.response?.data?.message || "Failed to update admin");
  }
},

}));
