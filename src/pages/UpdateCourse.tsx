import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useCoursesStore } from "@/store/useCoursesStore";

export default function UpdateCoursePage() {
  const { id } = useParams(); // course ID from route
  const { courses, fetchCourses, updateCourse } = useCoursesStore();
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");
  const [feeAmount, setFeeAmount] = useState("");

  // 🟢 Load course data
useEffect(() => {
  const loadCourse = async () => {
    if (courses.length === 0) await fetchCourses();
    const existing = courses.find((c) => c.courseId === Number(id));
    if (existing) {
      setCourseName(existing.courseName);
      setSemester(String(existing.semester));
      setFeeAmount(String(existing.feeAmount));
    } else {
      toast.error("Course not found");
      navigate("/courses");
    }
  };
  loadCourse();
}, [id, courses, fetchCourses, navigate]);

  // 🟢 Handle Update
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!courseName || !semester || !feeAmount) {
      toast.error("All fields are required");
      return;
    }

    try {
      await updateCourse(Number(id), {
        courseName,
        semester: Number(semester),
        feeAmount: Number(feeAmount),
      });
      toast.success("Course updated successfully!");
      navigate("/courses");
    } catch (error) {
      toast.error("Failed to update course");
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* ===== Page Header ===== */}
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Update Course
        </h1>
        <p className="text-muted-foreground mb-6">
          Edit and update existing course details
        </p>

        {/* ===== Form Card ===== */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Name */}
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  type="text"
                  placeholder="Enter course name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  required
                />
              </div>

              {/* Semester */}
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  type="number"
                  placeholder="Enter semester number"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                />
              </div>

              {/* Fee Amount */}
              <div className="space-y-2">
                <Label htmlFor="feeAmount">Fee Amount</Label>
                <Input
                  id="feeAmount"
                  type="number"
                  placeholder="Enter course fee"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value)}
                  required
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  className="px-6 font-medium hover:opacity-90 transition"
                >
                  Update Course
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
