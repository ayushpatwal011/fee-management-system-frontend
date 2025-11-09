import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useStudentStore } from "@/store/useStudentStore";
import { useCoursesStore } from "@/store/useCoursesStore";

export default function AddStudentPage() {
  const navigate = useNavigate();
  const { addStudent } = useStudentStore();
  const { courses, fetchCourses } = useCoursesStore();

  // 🧩 Form States
  const [fullName, setFullName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [parentName, setParentName] = useState("");
  const [courseId, setCourseId] = useState("");

  // 🟢 Load Courses for Dropdown
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // 🟢 Handle Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullName || !rollNo || !contactNo || !parentName || !courseId) {
      toast.error("All fields are required!");
      return;
    }

    try {
      await addStudent({
        fullName,
        rollNo,
        contactNo,
        parentName,
        courseId: Number(courseId),
      });
      toast.success("Student added successfully!");
      navigate("/students");
    } catch (error) {
      toast.error("Failed to add student");
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* ===== Page Header ===== */}
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Add New Student
        </h1>
        <p className="text-muted-foreground mb-6">
          Fill in the details to register a new student
        </p>

        {/* ===== Form Card ===== */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter student name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* Roll Number */}
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  type="text"
                  placeholder="Enter roll number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  required
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <Label htmlFor="contactNo">Contact Number</Label>
                <Input
                  id="contactNo"
                  type="tel"
                  placeholder="Enter contact number"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  required
                />
              </div>

              {/* Parent Name */}
              <div className="space-y-2">
                <Label htmlFor="parentName">Parent Name</Label>
                <Input
                  id="parentName"
                  type="text"
                  placeholder="Enter parent's name"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  required
                />
              </div>

              {/* Course Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="courseId">Course</Label>
                <select
                  id="courseId"
                  className="border rounded-md p-2 w-full dark:bg-black"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.courseName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  className="px-6 font-medium hover:opacity-90 transition"
                >
                  Add Student
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
