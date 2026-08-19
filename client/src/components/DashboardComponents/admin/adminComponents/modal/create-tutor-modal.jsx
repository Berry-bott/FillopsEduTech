
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminStore } from "@/store/adminStore";
import { Loader2 } from "lucide-react";

export default function CreateTutorModal({ open, onOpenChange, onSuccess }) {
  const { createTutor, loading } = useAdminStore();

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    expertise: "", // comma-separated → converted to array
    bio: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Convert expertise to array
    const expertiseArray = form.expertise
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const tutorData = {
      ...form,
      expertise: expertiseArray.length > 0 ? expertiseArray : undefined,
    };

    try {
      const response = await createTutor(tutorData);

      if (response.success) {
        setSuccessMessage(
          `Tutor created successfully! Credentials have been sent to ${form.email}.`
        );

        // Clear form
        setForm({
          email: "",
          firstName: "",
          lastName: "",
          expertise: "",
          bio: "",
        });

        // Optional: auto-close after 3 seconds or let user close manually
        setTimeout(() => {
          onSuccess?.();
          onOpenChange(false);
        }, 3000);
      } else {
        setError(response.message || "Failed to create tutor");
      }
    } catch (err) {
      setError(err.message || "An error occurred while creating tutor");
      console.error("Create tutor error:", err);
    }
  };

  const handleClose = () => {
    setForm({
      email: "",
      firstName: "",
      lastName: "",
      expertise: "",
      bio: "",
    });
    setError(null);
    setSuccessMessage(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Tutor</DialogTitle>
          <DialogDescription>
            Add a new tutor to the platform. Login credentials will be automatically generated and emailed to them.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded border border-emerald-200">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tutor@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertise">Expertise (comma separated)</Label>
            <Input
              id="expertise"
              name="expertise"
              placeholder="Mathematics, Physics, Chemistry"
              value={form.expertise}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">
              Example: Mathematics, Physics, Further Math
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio / About</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about the tutor's experience, qualifications, teaching style..."
              value={form.bio}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Tutor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}