import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import logo from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailId, password },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-auth-gradient px-4">
      <div className="auth-card animate-fadeUp w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="DevConnect" className="w-12 h-12" />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center">Welcome back</h1>
        <p className="text-center text-gray-400 text-sm mt-1">
          Sign in to continue to{" "}
          <span className="text-primary">DevConnect</span>
        </p>

        {error && (
          <p className="text-error text-sm text-center mt-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              className="input input-bordered w-full pl-10"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered w-full pl-10 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="text-right text-sm">
            <Link to="/forgot-password" className="link link-hover">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className={`btn btn-primary-gradient w-full ${
              loading ? "loading" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline transition"
          >
            Sign up
          </Link>
        </p>

        <p className="text-xs text-center text-gray-500 mt-4">
          🔒 Secure authentication using HttpOnly cookies
        </p>
      </div>
    </div>
  );
};

export default Login;
