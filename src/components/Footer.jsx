export default function Footer() {
  return (
    <footer
      className="mt-auto border-t border-sky-100"
      style={{
        background:
          "linear-gradient(135deg, #eefbff 0%, #e0f4ff 50%, #e8fff6 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #0ea5e9, #10b981)",
                }}
              >
                🛒
              </span>
              <span className="text-base font-extrabold text-[#0c2340] tracking-tight">
                Shop
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #0ea5e9, #10b981)",
                  }}
                >
                  Hub
                </span>
              </span>
            </div>
            <p className="text-xs text-sky-900/40 leading-relaxed font-light">
              Your one-stop shop for everything you need. Premium products,
              fast delivery, great prices.
            </p>
          </div>

          {/* About */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0c2340] mb-3">
              About Us
            </h4>
            <ul className="flex flex-col gap-1.5">
              {["Our Story", "Careers", "Press", "Blog"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-xs text-sky-900/40 hover:text-sky-600 transition font-medium"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0c2340] mb-3">
              Contact
            </h4>
            <ul className="flex flex-col gap-1.5">
              <li className="text-xs text-sky-900/40 font-medium">
                📧 support@shophub.com
              </li>
              <li className="text-xs text-sky-900/40 font-medium">
                📞 +91 98765 43210
              </li>
              <li className="text-xs text-sky-900/40 font-medium">
                📍 Kochi, Kerala, India
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-sky-900/40 hover:text-sky-600 transition font-medium"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Policies + Social */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0c2340] mb-3">
              Policies
            </h4>
            <ul className="flex flex-col gap-1.5 mb-5">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Return Policy",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-xs text-sky-900/40 hover:text-sky-600 transition font-medium"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social icons */}
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0c2340] mb-3">
              Follow Us
            </h4>
            <div className="flex gap-2">
              {[
                { icon: "X", label: "Twitter" },
                { icon: "in", label: "LinkedIn" },
                { icon: "f", label: "Facebook" },
                { icon: "yt", label: "YouTube" },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  title={label}
                  className="w-7 h-7 flex items-center justify-center border border-sky-200/60 rounded-lg text-[10px] font-bold text-sky-900/40 hover:text-white transition hover:-translate-y-px"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "linear-gradient(135deg, #0ea5e9, #10b981)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

       
      </div>
    </footer>
  );
}