import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAdminStore } from "@/store/useAdminStore";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { admin, updateAdmin, logout } = useAdminStore();
  

  const [email, setEmail] = useState(admin?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!admin) {
      toast.error("No admin logged in!");
      return;
    }

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await updateAdmin(admin.id, { email, password: password || undefined });
      toast.success("Profile updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="p-8 min-h-screen ">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your admin account details and security
          </p>
        </div>

        {/* 🧩 Account Info Card */}
        <Card className="shadow-sm border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Account Information</CardTitle>
            <p className="text-sm text-muted-foreground">
              Update your email or change your password
            </p>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="admin@college.com"
                />
              </div>
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  className="mt-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  className="mt-1"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                className="px-6 font-medium hover:opacity-90 transition"
                disabled={loading}
                onClick={handleUpdate}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 🔴 Logout Section */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-lg">Logout Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={handleLogout}
            >
              Logout Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
