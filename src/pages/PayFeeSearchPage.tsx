import { useState } from "react";
import { useStudentStore } from "@/store/useStudentStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function PayFeePage() {
  const { students, fetchStudents, loading } = useStudentStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.warning("Enter roll number or name to search");
      return;
    }

    if (students.length === 0) {
      await fetchStudents();
    }

    const results = students.filter(
      (s) =>
        s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (results.length === 0) {
      toast.error("No student found!");
    }
    setFiltered(results);
  };

  return (
    <div className="p-8 min-h-screen space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Pay Fee</h1>
        <p className="text-muted-foreground">
          Search student by roll number or name to proceed with payment
        </p>
      </div>

      {/* Search Box */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Search Student</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Enter roll number or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading} className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {filtered.length > 0 && (
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle>Matching Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filtered.map((student) => (
                <div
                  key={student.studentId}
                  onClick={() => navigate(`/payfee/${student.studentId}`)}
                  className="p-4 border rounded-md cursor-pointer hover:bg-muted transition flex justify-between items-center"
                >
                  <div>
                    <h2 className="font-semibold text-lg">{student.fullName}</h2>
                    <p className="text-sm text-muted-foreground">
                      Roll No: {student.rollNo} • {student.courseName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Paid: ₹{student.paidFee} / ₹{student.totalFee}
                    </p>
                    <p className="text-sm font-medium ">
                      Pending: ₹{student.pendingFee}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {filtered.length === 0 && searchTerm && !loading && (
        <p className="text-center text-muted-foreground">No student found.</p>
      )}
    </div>
  );
}
