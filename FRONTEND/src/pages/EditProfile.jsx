import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../store/slices/userSlice";

/* 🖼 Default Profile Photo */
const DEFAULT_PHOTO = "https://cdn-icons-png.flaticon.com/512/4140/4140047.png";

const MAX_ABOUT_LENGTH = 300;

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: 18,
    gender: "",
    about: "",
    skills: [],
    photoUrl: DEFAULT_PHOTO,
  });

  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* 🔹 Prefill user data */
  useEffect(() => {
    if (!user) return;

    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      age: user.age ?? 18,
      gender: user.gender || "",
      about: user.about || "",
      skills: user.skills || [],
      photoUrl: user.photoUrl || DEFAULT_PHOTO,
    });
  }, [user]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
    setSuccess("");
  };

  /* 🔹 Detect changes */
  const isDirty = useMemo(() => {
    if (!user) return false;

    return (
      JSON.stringify(form) !==
      JSON.stringify({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age ?? 18,
        gender: user.gender || "",
        about: user.about || "",
        skills: user.skills || [],
        photoUrl: user.photoUrl || DEFAULT_PHOTO,
      })
    );
  }, [form, user]);

  /* 🔹 Skills */
  const addSkill = () => {
    const value = skillInput.trim();
    if (!value || form.skills.includes(value)) return;

    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, value],
    }));
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  /* 💾 Save Profile */
  const saveProfile = async () => {
    if (!form.firstName || !form.lastName) {
      setError("First and last name are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.patch(`${BASE_URL}/profile/edit`, form, {
        withCredentials: true,
      });

      dispatch(addUser({ ...user, ...res.data.data }));
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-base-200 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-base-100 rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="text-sm opacity-70">
            Keep your profile professional and up to date
          </p>
        </div>

        {error && <div className="alert alert-error mb-4">{error}</div>}
        {success && <div className="alert alert-success mb-4">{success}</div>}

        {/* Profile Photo */}
        <section className="mb-8">
          <div className="flex items-center gap-5 justify-center">
            <div className="avatar ">
              <div className="w-40 rounded-full ring ring-primary ring-offset-2 flex">
                <img
                  src={form.photoUrl}
                  alt="Profile"
                  onError={(e) => (e.currentTarget.src = DEFAULT_PHOTO)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Personal Info */}
        <section className="mb-6">
          <h3 className="font-semibold mb-3">Personal Information</h3>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input
              className="input input-bordered"
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
            />
            <input
              className="input input-bordered"
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="number"
              min={18}
              className="input input-bordered"
              placeholder="Age"
              value={form.age}
              onChange={(e) => updateField("age", Number(e.target.value))}
            />
            <select
              className="select select-bordered"
              value={form.gender}
              onChange={(e) => updateField("gender", e.target.value)}
            >
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-6">
          <h3 className="font-semibold mb-3">Skills</h3>

          <div className="flex gap-2">
            <input
              className="input input-bordered flex-1"
              placeholder="React, Java, DSA..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={addSkill}
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {form.skills.map((skill) => (
              <span key={skill} className="badge badge-outline gap-2">
                {skill}
                <button onClick={() => removeSkill(skill)}>✕</button>
              </span>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="mb-8">
          <h3 className="font-semibold mb-2">About</h3>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={4}
            maxLength={MAX_ABOUT_LENGTH}
            placeholder="Your role, interests, and goals..."
            value={form.about}
            onChange={(e) => updateField("about", e.target.value)}
          />
          <div className="text-xs text-right opacity-60 mt-1">
            {form.about.length}/{MAX_ABOUT_LENGTH}
          </div>

          <input
            type="url"
            className="input input-bordered flex-1 w-full my-3"
            placeholder="Paste profile image URL"
            value={form.photoUrl}
            onChange={(e) => updateField("photoUrl", e.target.value)}
          />
        </section>

        {/* Save */}
        <button
          className="btn btn-primary w-full"
          disabled={loading || !isDirty}
          onClick={saveProfile}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
