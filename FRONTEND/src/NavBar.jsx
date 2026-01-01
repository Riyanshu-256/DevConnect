import logo from "./assets/logo.png";

const NavBar = () => {
  return (
    <div>
      <div className="navbar bg-base-300 border-b border-base-300 px-6 sticky top-0 z-50">
        {/* Left: Brand */}
        <div className="flex-1">
          <a className="flex items-center gap-3 hover:opacity-90 transition">
            <img
              src={logo}
              alt="DevConnect Logo"
              className="w-12 h-12 rounded-xl"
            />
            <span className="text-xl font-bold tracking-tight">
              Dev<span className="text-primary">Connect</span>
            </span>
          </a>
        </div>

        {/* Center: Search (hidden on small screens) */}
        {/* <div className="hidden md:flex">
              <input
                type="text"
                placeholder="Search developers, skills..."
                className="input input-bordered w-64 focus:outline-none focus:border-primary"
              />
            </div> */}

        {/* Right: Profile */}
        <div className="flex items-center gap-4">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                <img
                  alt="User avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 w-52 rounded-xl bg-base-100 p-2 shadow-lg border border-base-300"
            >
              <li>
                <a className="justify-between">Profile</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a className="text-error">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Connect with <span className="text-primary">Developers</span> <br />
            Build. Collaborate. Grow.
          </h1>

          <p className="mt-5 text-base md:text-lg text-gray-500">
            DevConnect is a professional platform where developers connect,
            collaborate on ideas, and grow together in the tech ecosystem.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button className="btn btn-primary px-6">Get Started</button>
            <button className="btn btn-outline px-6">Explore Developers</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NavBar;
