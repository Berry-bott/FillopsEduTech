import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminStore } from "@/store/adminStore";
import { Loader2 } from "lucide-react";

export default function EditTutorModal({ tutor, open, onOpenChange, onSuccess }) {
  const { updateTutor, loading } = useAdminStore();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    expertise: "",
  });

  useEffect(() => {
    if (tutor) {
      setForm({
        firstName: tutor.firstName || "",
        lastName: tutor.lastName || "",
        email: tutor.email || "",
        bio: tutor.bio || "",
        expertise: (tutor.expertise || []).join(", "),
      });
    }
  }, [tutor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expertiseArray = form.expertise
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const updates = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      bio: form.bio,
      expertise: expertiseArray.length > 0 ? expertiseArray : undefined,
    };

    try {
      await updateTutor(tutor.id, updates);
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Tutor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Expertise (comma separated)</Label>
            <Input
              name="expertise"
              value={form.expertise}
              onChange={handleChange}
              placeholder="Maths, Physics, Chemistry"
            />
          </div>

          <div>
            <Label>Bio</Label>
            <Textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}