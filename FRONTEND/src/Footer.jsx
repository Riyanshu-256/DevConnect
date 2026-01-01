import logo from "./assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-base-300 border-t border-base-content/10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">
        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="DevConnect Logo"
              className="w-10 h-10 rounded-xl"
            />
            <span className="text-xl font-bold tracking-tight">
              Dev<span className="text-primary">Connect</span>
            </span>
          </div>
          <p className="text-sm text-base-content/70 leading-relaxed">
            DevConnect is a platform where developers connect, collaborate, and
            grow together through meaningful professional connections.
          </p>
          <p className="text-xs text-base-content/50">
            © {new Date().getFullYear()} DevConnect. All rights reserved.
          </p>
        </div>

        {/* Product */}
        <div>
          <h6 className="mb-3 font-semibold uppercase text-sm tracking-wide">
            Product
          </h6>
          <ul className="space-y-2 text-sm">
            <li className="link link-hover">Explore Developers</li>
            <li className="link link-hover">Connections</li>
            <li className="link link-hover">Requests</li>
            <li className="link link-hover">Feed</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h6 className="mb-3 font-semibold uppercase text-sm tracking-wide">
            Company
          </h6>
          <ul className="space-y-2 text-sm">
            <li className="link link-hover">About</li>
            <li className="link link-hover">Careers</li>
            <li className="link link-hover">Contact</li>
            <li className="link link-hover">Blog</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h6 className="mb-3 font-semibold uppercase text-sm tracking-wide">
            Legal
          </h6>
          <ul className="space-y-2 text-sm">
            <li className="link link-hover">Privacy Policy</li>
            <li className="link link-hover">Terms of Service</li>
            <li className="link link-hover">Cookie Policy</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
