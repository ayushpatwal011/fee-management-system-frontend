import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCoursesStore } from "@/store/useCoursesStore";
import { usePaymentStore } from "@/store/usePaymentStore";
import { useStudentStore } from "@/store/useStudentStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const { coursesCount } = useCoursesStore();
  const { studentCount, totalPaidFee } = useStudentStore();
  const { latestPayments, dailyFeesData , totalPaidAmount } = usePaymentStore();

  const { calculateTotalWithStudents } = useCoursesStore();
const totalSystemFee = calculateTotalWithStudents(); // ✅ correct grand total



  const feeDistribution = [
    { name: "Paid Fees", value: totalSystemFee },
    { name: "Pending Fees", value: totalPaidFee },
  ];
  const COLORS = ["#3791DB", "#3B3C42"]; // blue + red


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Fee Management System</p>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Courses</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{coursesCount}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{studentCount}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Fees</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">₹{totalSystemFee}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paid Fees</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">₹{totalPaidAmount}</CardContent>
        </Card>
      </div>


      {/* ===== Charts Section ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Fees Submission Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Fees Submission (Last 10 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyFeesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`₹${value}`, "Collected Fees"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar dataKey="fees" fill="#BC2BC4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart: Fee Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={feeDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₹${value}`}
                >
                  {feeDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`₹${value}`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ===== Recent Payments ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {latestPayments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No recent payments found.
            </p>
          ) : (
            <ul className="space-y-3">
              {latestPayments.map((p, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center border-b pb-2 text-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{p.studentName}</span>
                    <span className="text-muted-foreground text-xs">
                      {p.courseName}
                    </span>
                  </div>
                  <span className="font-semibold">₹{p.amountPaid}</span>
                  <span className="text-muted-foreground text-xs">
                    {p.paymentDate}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
