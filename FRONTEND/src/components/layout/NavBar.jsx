import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { removeUser } from "../../store/slices/userSlice";
import { BASE_URL } from "../../utils/constants";
import logo from "../../assets/logo.png";
import { User, Users, Mail, LogOut } from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [loggingOut, setLoggingOut] = useState(false);

  const isHomePage = location.pathname === "/";
  const user = useSelector((store) => store.user);

  // ================= LOGOUT =================
  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div>
      {/* ================= NAVBAR ================= */}
      <div className="navbar bg-base-300 border-b border-base-200 px-6 sticky top-0 z-50">
        {/* LEFT: BRAND */}
        <div className="flex-1">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
          >
            <img
              src={logo}
              alt="DevConnect Logo"
              className="w-10 h-10 rounded-xl"
            />
            <span className="text-xl font-bold tracking-tight">
              Dev<span className="text-primary">Connect</span>
            </span>
          </div>
        </div>

        {/* RIGHT: SIGN IN / SIGN UP (ONLY WHEN LOGGED OUT) */}
        {!user && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="btn btn-ghost btn-sm"
            >
              Sign in
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="btn btn-primary btn-sm px-5"
            >
              Sign up
            </button>
          </div>
        )}

        {/* RIGHT: USER DROPDOWN (ONLY WHEN LOGGED IN) */}
        {user && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              className="flex items-center gap-3 cursor-pointer px-3 py-1 rounded-full hover:bg-base-200 transition"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-400 leading-tight">Welcome</p>
                <p className="font-semibold leading-tight">{user.firstName}</p>
              </div>

              <div className="avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  <img
                    src={
                      user?.photoUrl?.startsWith("http")
                        ? user.photoUrl
                        : DEFAULT_AVATAR
                    }
                    alt="User Avatar"
                  />
                </div>
              </div>
            </div>
            {/* DROPDOWN MENU */}
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-4 w-60 rounded-2xl 
             bg-base-100 p-3 shadow-2xl 
             border border-base-200 
             animate-in fade-in zoom-in-95"
            >
              {/* Title */}
              <li className="menu-title px-2 mb-1">
                <span className="text-xs uppercase tracking-wider text-base-content/50">
                  Account
                </span>
              </li>

              {/* Profile */}
              <li>
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 
                 hover:bg-base-200 transition"
                >
                  <User size={16} className="opacity-70" />
                  <span>Profile</span>
                </button>
              </li>

              {/* Connections */}
              <li>
                <button
                  onClick={() => navigate("/connections")}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 
                 hover:bg-base-200 transition"
                >
                  <Users size={16} className="opacity-70" />
                  <span>Connections</span>
                </button>
              </li>

              {/* Requests */}
              <li>
                <button
                  onClick={() => navigate("/requests")}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 
                 hover:bg-base-200 transition"
                >
                  <Mail size={16} className="opacity-70" />
                  <span>Requests</span>
                </button>
              </li>

              <div className="divider my-2"></div>

              {/* Logout */}
              <li>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 
        text-error hover:bg-error/10 transition
        ${loggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <LogOut size={16} />
                  <span>{loggingOut ? "Logging out..." : "Logout"}</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* ================= HERO (ONLY HOME PAGE) ================= */}
      {isHomePage && !user && (
        <section className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden bg-base-100">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 blur-3xl"></div>

          <div className="relative max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Connect with{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Developers
              </span>
              <br />
              Build. Collaborate. Grow.
            </h1>

            <p className="mt-6 text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
              DevConnect is a modern professional platform where developers
              showcase skills, collaborate on ideas, and grow together in the
              tech ecosystem.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="btn btn-primary px-8 text-base"
              >
                Get Started
              </button>

              <button
                onClick={() => navigate("/login")}
                className="btn btn-outline btn-secondary px-8 text-base"
              >
                Build Your Network
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ================= WHY DEVCONNECT ================= */}
      {isHomePage && (
        <section className="py-24 bg-base-200 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Why Dev<span className="text-primary">Connect</span>?
              </h2>

              <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
                Designed with scalability, performance, and real-world developer
                needs in mind.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Secure Authentication",
                  desc: "JWT authentication with HTTP-only cookies and production-grade CORS.",
                },
                {
                  title: "Developer Profiles",
                  desc: "Showcase skills, experience, and professional identity.",
                },
                {
                  title: "Smart Connections",
                  desc: "Connect with developers based on skills and interests.",
                },
                {
                  title: "Fast & Scalable",
                  desc: "Built using React, Redux, Node.js, and MongoDB.",
                },
                {
                  title: "Connection Requests",
                  desc: "Send, accept, and manage professional connections.",
                },
                {
                  title: "Production Ready",
                  desc: "Clean architecture, error handling, loaders, and deploy-ready.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-base-100 p-8 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default NavBar;
