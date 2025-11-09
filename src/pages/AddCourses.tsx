import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useCoursesStore } from "@/store/useCoursesStore";
import { useNavigate } from "react-router-dom";

export  function AddCoursePage() {
  const { addCourse } = useCoursesStore();
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");
  const [feeAmount, setFeeAmount] = useState("");

const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!courseName || !semester || !feeAmount) {
    toast.error("All fields are required");
    return;
  }

  try {
    await addCourse({
      courseName,
      semester: Number(semester),
      feeAmount: Number(feeAmount),
    });
    toast.success("Course added successfully!");
    navigate("/courses");
  } catch (error) {
    toast.error("Failed to add course");
  }
};


  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* ===== Page Header ===== */}
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Add New Course
        </h1>
        <p className="text-muted-foreground mb-6">
          Create a new course by entering the details below
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
                  Add Course
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
