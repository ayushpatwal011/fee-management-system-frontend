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
import { useCoursesStore } from "@/store/useCoursesStore";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CoursesPage() {
  const { courses, fetchCourses, loading, deleteCourse } = useCoursesStore();
  console.log(courses);
  

  const navigate = useNavigate()

  // 🟢 Fetch all courses when page loads
  useEffect(() => {
    const loadCourses = async () => {
      try {
        await fetchCourses();
      } catch (error) {
        toast.error("Failed to fetch courses");
      }
    };
    loadCourses();
  }, [fetchCourses]);

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">Manage course information</p>
        </div>
        <Button onClick={()=>{navigate("/add-courses")}} className="flex items-center gap-2">
          <Plus className="size-4" /> Add Course
        </Button>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Course Records</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sno.</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* 🟡 Loading State */}
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Loading courses...
                    </TableCell>
                  </TableRow>
                ) : courses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  courses.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{c.courseName}</TableCell>
                      <TableCell>{c.semester}</TableCell>
                      <TableCell>₹{c.feeAmount}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button onClick={()=>{navigate(`/courses/update/${c.courseId}`)}} size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button onClick={()=>{deleteCourse(c.courseId)}} size="sm" variant="destructive">
                          Delete
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
