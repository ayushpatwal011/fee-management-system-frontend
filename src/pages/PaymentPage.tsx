import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePaymentStore } from "@/store/usePaymentStore";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

export default function PaymentsPage() {
  const { payments, fetchPayments, loading } = usePaymentStore();

  // 🟢 Load all payments when component mounts
  useEffect(() => {
    const load = async () => {
      try {
        await fetchPayments();
      } catch (error) {
        toast.error("Failed to load payments");
      }
    };
    load();
  }, [fetchPayments]);

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Record and track fee payments</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="size-4" /> Add Payment
        </Button>
      </div>

      {/* Payment Table */}
      <Card className="shadow-sm border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Payment Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid %</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* 🟡 Show loading or empty state */}
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Loading payments...
                    </TableCell>
                  </TableRow>
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((p, i) => (
                    <TableRow key={p.paymentId}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{p.studentName || "Unknown"}</TableCell>
                      <TableCell>{p.courseName || "N/A"}</TableCell>
                      <TableCell>₹{p.amountPaid}</TableCell>
                      <TableCell>
                        {p.paidPercentage ? `${p.paidPercentage}%` : "—"}
                      </TableCell>
                      <TableCell>{p.paymentMode}</TableCell>
                      <TableCell>{p.paymentDate}</TableCell>
                      <TableCell>{p.remarks}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
