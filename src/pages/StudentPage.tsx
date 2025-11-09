import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { useStudentStore } from "@/store/useStudentStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function StudentsPage() {
  const { students, fetchStudents, loading } = useStudentStore();
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(students);

  console.log(students);

  const navigate = useNavigate();
  // 🟢 Load all students on mount
  useEffect(() => {
    const load = async () => {
      try {
        await fetchStudents();
      } catch (error) {
        toast.error("Failed to load students");
      }
    };
    load();
  }, [fetchStudents]);

  // 🟣 Sync filtered list whenever students change
  useEffect(() => {
    setFiltered(students);
  }, [students]);

  // 🔍 Search handler
  const handleSearch = () => {
    if (!query.trim()) {
      setFiltered(students);
      return;
    }

    const q = query.toLowerCase();
    const results = students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q)
    );

    if (results.length === 0) toast.info("No student found");
    setFiltered(results);
  };

  // 🟡 Reset filter
  const handleShowAll = () => {
    setQuery("");
    setFiltered(students);
  };

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage and track student information
          </p>
        </div>
        <Button
          onClick={() => navigate("/add-student")}
          className="flex items-center gap-2"
        >
          <Plus className="size-4" />
          Add Student
        </Button>
      </div>

      {/* Table Section */}
      <Card className="shadow-sm border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Student Records
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Search Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex w-full sm:w-1/2 items-center gap-2">
              <Input
                placeholder="Search by name or roll number..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                variant="default"
                className="flex items-center gap-1"
                onClick={handleSearch}
              >
                <Search className="size-4" /> Search
              </Button>
            </div>
            <Button variant="outline" onClick={handleShowAll}>
              Show All
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Loading students...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No student records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s, i) => (
                    <TableRow key={s.studentId}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{s.rollNo}</TableCell>
                      <TableCell>{s.fullName}</TableCell>
                      <TableCell>{s.courseName}</TableCell>
                      <TableCell>{s.contactNo}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(`/students/profile/${s.studentId}`)
                          }
                        >
                          View
                        </Button>

                        <Button
                          onClick={() =>
                            navigate(`/student/update/${s.studentId}`)
                          }
                          size="sm"
                          variant="outline"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => navigate(`/payfee/${s.studentId}`)}
                          
                        >
                          Pay
                        </Button>
                      </TableCell>
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
