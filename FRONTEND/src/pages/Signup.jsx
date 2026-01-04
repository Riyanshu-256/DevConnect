import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";

import { BASE_URL } from "../utils/constants";

const DEFAULT_PHOTO = "https://cdn-icons-png.flaticon.com/512/4140/4140047.png";

/* =======================
   PASSWORD RULE
======================= */
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

const Signup = () => {
  const navigate = useNavigate();

  /* =======================
     FORM STATE
  ======================= */
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    age: "",
    gender: "",
    about: "",
    photoUrl: DEFAULT_PHOTO,
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  /* =======================
     UI STATE
  ======================= */
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =======================
     HELPERS
  ======================= */
  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value || skills.includes(value)) return;
    setSkills((prev) => [...prev, value]);
    setSkillInput("");
  };

  const removeSkill = (skill) =>
    setSkills((prev) => prev.filter((s) => s !== skill));

  /* =======================
     SUBMIT
  ======================= */
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    /* 🔐 Frontend validation */
    if (!passwordRegex.test(form.password)) {
      return setError(
        "Password must be at least 8 characters and include a number & special symbol"
      );
    }

    if (form.age && Number(form.age) < 18) {
      return setError("You must be at least 18 years old");
    }

    try {
      setLoading(true);

      await axios.post(
        `${BASE_URL}/signup`,
        { ...form, skills },
        { withCredentials: true }
      );

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-auth-gradient px-4">
      <div className="auth-card w-full max-w-2xl my-10 animate-fadeUp">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create your account</h1>
          <p className="text-gray-400 text-sm mt-2">
            Join <span className="text-primary font-medium">DevConnect</span>{" "}
            and build your network
          </p>
        </div>

        {/* Error */}
        {error && <div className="alert alert-error text-sm mb-6">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Name */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              icon={<FaUser />}
              label="First Name"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              required
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
            />
          </div>

          {/* Email */}
          <Input
            type="email"
            icon={<FaEnvelope />}
            label="Email address"
            value={form.emailId}
            onChange={(e) => updateField("emailId", e.target.value)}
            required
          />

          {/* Password */}
          <div>
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <FaLock /> Password
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pr-10"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Minimum 8 characters, include symbols & numbers
            </p>
          </div>

          {/* Age + Gender */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="number"
              min={18}
              placeholder="Age"
              className="input input-bordered"
              value={form.age}
              onChange={(e) => updateField("age", e.target.value)}
            />
            <select
              className="select select-bordered"
              value={form.gender}
              onChange={(e) => updateField("gender", e.target.value)}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* About */}
          <textarea
            rows={3}
            className="textarea textarea-bordered w-full"
            placeholder="Briefly describe yourself"
            value={form.about}
            onChange={(e) => updateField("about", e.target.value)}
          />

          {/* Skills */}
          <div>
            <label className="label">
              <span className="label-text">Skills</span>
            </label>
            <div className="flex gap-2">
              <input
                className="input input-bordered flex-1"
                placeholder="Add skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn btn-primary btn-sm"
              >
                Add
              </button>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="badge badge-primary badge-outline gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="opacity-70 hover:opacity-100"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Photo */}
          <Input
            icon={<FaUserCircle />}
            label="Profile Photo URL"
            placeholder="https://example.com/profile.jpg"
            value={form.photoUrl}
            onChange={(e) => updateField("photoUrl", e.target.value)}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary-gradient w-full ${
              loading ? "loading" : ""
            }`}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

/* =======================
   REUSABLE INPUT
======================= */
const Input = ({ label, icon, type = "text", ...props }) => (
  <div>
    {label && (
      <label className="label">
        <span className="label-text flex items-center gap-2">
          {icon} {label}
        </span>
      </label>
    )}
    <input type={type} className="input input-bordered w-full" {...props} />
  </div>
);

export default Signup;
