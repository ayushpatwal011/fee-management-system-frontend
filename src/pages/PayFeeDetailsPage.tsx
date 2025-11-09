import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudentStore } from "@/store/useStudentStore";
import { usePaymentStore } from "@/store/usePaymentStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { ArrowLeft, Wallet } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function PayFeeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, fetchStudents } = useStudentStore();
  const { createPayment } = usePaymentStore();

  const [student, setStudent] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [remarks, setRemarks] = useState("");

  // 🧩 Load student details by ID
  useEffect(() => {
    const loadStudent = async () => {
      if (students.length === 0) await fetchStudents();
      const found = students.find((s) => s.studentId === Number(id));

      if (!found) {
        toast.error("Student not found");
        navigate("/payfee");
      } else {
        setStudent(found);
       if ((found.pendingFee ?? 0) > 0) {
  setAmount((found.pendingFee ?? 0).toString());
}

      }
    };
    loadStudent();
  }, [id, students, fetchStudents, navigate]);

  // 🕓 Loading fallback
  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Loading student info...
      </div>
    );
  }

  // 🧾 Handle payment submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await createPayment({
        studentId: student.studentId,
        amountPaid: numericAmount,
        paymentMode,
        remarks,
      });

      toast.success("Payment recorded successfully!");
      navigate("/students");
    } catch (error) {
      toast.error("Payment failed");
      console.error(error);
    }
  };

  const paidPercentage = student.totalFee
    ? Math.min((student.paidFee / student.totalFee) * 100, 100)
    : 0;

  const pendingFee = student.totalFee - student.paidFee;

  return (
    <div className="p-8 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Pay Fee — {student.fullName}
          </h1>
          <p className="text-muted-foreground">Roll No: {student.rollNo}</p>
        </div>
        <Button variant="ghost" onClick={() => navigate("/payfee")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Student Overview */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <strong>Course:</strong> {student.courseName}
          </div>
          <div>
            <strong>Total Fee:</strong> ₹{student.totalFee}
          </div>
          <div>
            <strong>Paid Fee:</strong> ₹{student.paidFee}
          </div>
          <div>
            <strong>Pending Fee:</strong> ₹{pendingFee}
          </div>
          <div>
            <strong>Last Payment:</strong> {student.lastPaymentDate || "N/A"}
          </div>
          <div>
            <strong>Parent:</strong> {student.parentName}
          </div>
        </CardContent>
      </Card>

      {/* Fee Progress */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Fee Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={paidPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{paidPercentage.toFixed(1)}% Paid</span>
            <span>{(100 - paidPercentage).toFixed(1)}% Pending</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Make a Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Amount to Pay</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <Label>Payment Mode</Label>
              <Select value={paymentMode} onValueChange={setPaymentMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Remarks</Label>
              <Input
                placeholder="Enter remarks (optional)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="flex items-center gap-2 font-medium"
              >
                <Wallet className="h-4 w-4" />
                Pay Now
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
