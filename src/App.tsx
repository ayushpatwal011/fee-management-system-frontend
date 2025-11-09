import Navbar from "./components/Navbar";
import { AppSidebar } from "./components/Sidebar";
import CoursesPage from "./pages/CoursesPage";
import Dashboard from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import PaymentsPage from "./pages/PaymentPage";
import ProfilePage from "./pages/ProfilePage";
import StudentsPage from "./pages/StudentPage";
import { AddCoursePage } from "./pages/AddCourses";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { useCoursesStore } from "./store/useCoursesStore";
import { useStudentStore } from "./store/useStudentStore";
import { usePaymentStore } from "./store/usePaymentStore";
import UpdateCoursePage from "./pages/UpdateCourse";
import AddStudentPage from "./pages/AddStudent";
import UpdateStudentPage from "./pages/UpdateStudent";
import StudentProfilePage from "./pages/StudentProfilePage";
import PayFeePage from "./pages/PayFeeSearchPage";
import PayFeeDetailsPage from "./pages/PayFeeDetailsPage";

function App() {
  const { admin } = useAdminStore();
  const {  fetchCourses} = useCoursesStore();
  const {  fetchStudents} = useStudentStore();
  const {  fetchPayments} = usePaymentStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(()=>{
      fetchCourses()
      fetchStudents()
      fetchPayments()
  },[])

  

  return !admin ? (
    <LoginPage />
  ) : (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      {/* Navbar */}
      <Navbar />

      {/* Layout */}
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 border-r bg-card">
          <AppSidebar email={admin.email} />
        </aside>

        {/* Mobile Sidebar Drawer */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
        >
          <AppSidebar email={admin.email} />
        </div>

        {/* Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Mobile Toggle */}
          <div className="flex items-center justify-between md:hidden mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-lg">Fee Management</h1>
          </div>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard   />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/add-courses" element={<AddCoursePage />} />
            <Route path="/courses/update/:id" element={<UpdateCoursePage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/add-student" element={<AddStudentPage />} />
            <Route path="/student/update/:id" element={<UpdateStudentPage />} />
            <Route path="/students/profile/:id" element={<StudentProfilePage/>} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/payfee" element={<PayFeePage />} />
            <Route path="/payfee/:id" element={<PayFeeDetailsPage />} /> 
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
