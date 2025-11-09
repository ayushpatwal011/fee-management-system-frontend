import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { useStudentStore } from "@/store/useStudentStore";
import { usePaymentStore } from "@/store/usePaymentStore";

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { students, fetchStudents } = useStudentStore();
  const { getPaymentsByStudent } = usePaymentStore();

  const [student, setStudent] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const loadStudent = async () => {
      if (students.length === 0) await fetchStudents();
      const found = students.find((s) => s.studentId === Number(id));

      if (!found) {
        toast.error("Student not found");
        navigate("/students");
        return;
      }

      setStudent(found);

      const paymentList = await getPaymentsByStudent(Number(id));
      if (paymentList) setPayments(paymentList);
    };

    loadStudent();
  }, [id, students, fetchStudents, getPaymentsByStudent, navigate]);

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Loading student info...
      </div>
    );
  }

  const paidPercentage = student.totalFee
    ? Math.min((student.paidFee / student.totalFee) * 100, 100)
    : 0;

  const pendingFee = student.totalFee - student.paidFee;
  const lastPayment = payments?.[0] || null; // Most recent payment

  return (
    <div className="p-8 min-h-screen space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {student.fullName}'s Profile
          </h1>
          <p className="text-muted-foreground">Roll No: {student.rollNo}</p>
        </div>
        <Button variant="ghost" onClick={() => navigate("/students")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* ===== Student Info ===== */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><strong>Course:</strong> {student.courseName}</div>
          <div><strong>Total Fee:</strong> ₹{student.totalFee}</div>
          <div><strong>Paid Fee:</strong> ₹{student.paidFee}</div>
          <div><strong>Pending Fee:</strong> ₹{pendingFee}</div>
          <div><strong>Contact:</strong> {student.contactNo}</div>
          <div><strong>Parent Name:</strong> {student.parentName}</div>
          <div><strong>Admission Date:</strong> {student.admissionDate}</div>
        </CardContent>
      </Card>

      {/* ===== Fee Progress ===== */}
      <Card className="shadow-sm border">
        <CardHeader><CardTitle>Fee Progress</CardTitle></CardHeader>
        <CardContent>
          <Progress value={paidPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{paidPercentage.toFixed(1)}% Paid</span>
            <span>{(100 - paidPercentage).toFixed(1)}% Pending</span>
          </div>
        </CardContent>
      </Card>

      {/* ===== Last Payment Details ===== */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Last Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          {lastPayment ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div><strong>Amount Paid:</strong> ₹{lastPayment.amountPaid}</div>
              <div><strong>Payment Mode:</strong> {lastPayment.paymentMode}</div>
              <div><strong>Date:</strong> {lastPayment.paymentDate}</div>
              <div><strong>Remarks:</strong> {lastPayment.remarks || "—"}</div>
              <div><strong>Course:</strong> {lastPayment.courseName}</div>
              <div>
                <strong>Paid Percentage:</strong> {lastPayment.paidPercentage}%
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No payment record found for this student.
            </p>
          )}
        </CardContent>
      </Card>

      
    </div>
  );
}
