import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";

export default function MyInfo() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const updated = await authService.updateProfile({
        fullName,
        phone,
      });
      updateUser(updated);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Failed to save profile", err);
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>

      <div className="bg-bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {user?.fullName || "Guest User"}
            </h3>
            <p className="text-text-secondary">{user?.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">
              Full Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                size={16}
              />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-bg-secondary border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                size={16}
              />
              <input
                type="email"
                defaultValue={user?.email || ""}
                disabled
                className="w-full bg-bg-secondary/50 border border-border rounded-xl py-3 pl-10 pr-4 text-text-muted cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">
              Phone Number
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                size={16}
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 99999 99999"
                className="w-full bg-bg-secondary border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg text-sm border ${
              message.type === "success"
                ? "bg-accent-green/10 text-accent-green border-accent-green/20"
                : "bg-accent-red/10 text-accent-red border-accent-red/20"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {message.text}
          </div>
        )}

        <div className="pt-6 border-t border-border flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary px-8 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
