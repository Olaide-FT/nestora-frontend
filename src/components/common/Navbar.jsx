import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  X,
  UserRound,
  ArrowRight,
  LogOut,
  LayoutDashboard,
  Heart,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getFavorites } from "../../services/favoriteService";
import NestoraLogo from "./NestoraLogo";



const navItems = [
  { label: "Home", path: "/" },
  { label: "Properties", path: "/properties" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

  function Navbar({ variant = "light" }) {
  const isDark = variant === "dark";
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const surfaceClass = isHomePage
    ? "border-white/15 bg-dark/35 text-white shadow-2xl shadow-black/10 ring-1 ring-white/5"
    : "border-primary/10 bg-white/80 text-primary shadow-xl shadow-primary/5 ring-1 ring-white/60";
  const linkClass = isHomePage
    ? "text-white/90 hover:text-accent"
    : "text-[#0e3b34] hover:text-[#174e46]";
  const mutedButtonClass = isHomePage
    ? "border-white/30 text-white hover:border-white hover:bg-white/10"
    : "border-primary/15 text-primary hover:border-primary/30 hover:bg-primary/5";
  const mobilePanelClass = isHomePage
    ? "border-white/15 bg-dark/75 text-white shadow-2xl shadow-black/20 ring-1 ring-white/5"
    : "border-primary/10 bg-white/80 text-primary shadow-xl shadow-primary/10 ring-1 ring-white/60";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "buyer") {
      setFavoriteCount(0);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const data = await getFavorites();
        const items = Array.isArray(data?.favorites) ? data.favorites : Array.isArray(data) ? data : [];
        setFavoriteCount(items.filter((item) => item?.property?._id || item?.property?.id).length);
      } catch (error) {
        console.error("Failed to fetch favorites count:", error);
        setFavoriteCount(0);
      }
    };

    fetchFavorites();

    const handleFavoritesUpdated = () => fetchFavorites();
    window.addEventListener("nestora:favorites:updated", handleFavoritesUpdated);

    return () => {
      window.removeEventListener("nestora:favorites:updated", handleFavoritesUpdated);
    };
  }, [isAuthenticated, user?.role]);

  const getProfilePath = () => {
    if (user?.role === "buyer") {
      return "/buyer/profile";
    }

    if (user?.role === "owner") {
      return "/owner/profile";
    }

    if (user?.role === "admin") {
      return "/admin/profile";
    }

    return "/login";
  };

  const getDashboard = () => {
    if (user?.role === "buyer") {
      return "/buyer/dashboard";
    }

    if (user?.role === "owner") {
      return "/owner/dashboard";
    }

    if (user?.role === "admin") {
      return "/admin/dashboard";
    }

    return "/";
  };

  const dashboardLabel = user?.role === "buyer" ? "Home" : "Dashboard";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="absolute left-0 right-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
        <nav className={`flex items-center justify-between rounded-2xl px-4 py-3 backdrop-blur-2xl ${surfaceClass}`}>

          <Link
            to="/"
            className={`font-heading text-2xl font-bold tracking-tight `}
          >
            <NestoraLogo color={isHomePage ? "#C9A45C" : "#0e3b34"} />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group relative font-body text-sm font-medium transition ${
                    isActive
                      ? (isHomePage ? "text-accent" : "text-[#0e3b34]")
                      : linkClass
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative inline-flex items-center pb-1">
                    {item.label}
                    {isActive && (
                      <span
                        className={`absolute -bottom-1 left-0 h-0.5 origin-left rounded-full ${
                          isHomePage ? "bg-accent" : "bg-[#0e3b34]"
                        }`}
                        style={{
                          width: "100%",
                          animation: "navUnderlineSlide 0.9s ease-out forwards",
                        }}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 font-body text-sm font-semibold transition ${mutedButtonClass}`}
                >
                  <UserRound size={16} />
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-body text-sm font-semibold text-dark"
                >
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              </>
            ) : (
              <>
                {user?.role === "buyer" && (
                  <Link
                    to="/buyer/favorites"
                    className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition ${mutedButtonClass}`}
                    aria-label="Favorites"
                  >
                    <Heart size={18} />
                    {favoriteCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-dark">
                        {favoriteCount > 99 ? "99+" : favoriteCount}
                      </span>
                    )}
                  </Link>
                )}

                <Link
                  to={getProfilePath()}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${mutedButtonClass}`}
                  aria-label="Profile"
                >
                  <UserRound size={18} />
                </Link>

                {user?.role !== "buyer" && (
                  <Link
                    to={getDashboard()}
                    className={`flex items-center gap-2 rounded-lg border px-5 py-2.5 font-body text-sm font-semibold ${mutedButtonClass}`}
                  >
                    <LayoutDashboard size={16} />
                    {dashboardLabel}
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-body text-sm font-semibold text-dark"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}

          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={isDark ? "text-white md:hidden" : "#e5ebe9 md:hidden"}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}
          </button>
        </nav>

        {mobileOpen && (
          <div className={`mt-5 rounded-2xl border p-5 backdrop-blur-2xl md:hidden ${mobilePanelClass}`}>
            <div className="flex flex-col gap-5">

              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`font-body text-sm font-semibold ${isDark ? "text-white" : "#e5ebe9"}`}
                >
                  {item.label}
                </NavLink>
              ))}

              <div className={`flex flex-col gap-3 border-t pt-5 ${isDark ? "border-white/10" : "border-primary/10"}`}>

                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className={`rounded-lg border px-5 py-3 text-center font-body text-sm font-semibold  ${mutedButtonClass}`}
                    >
                      Sign In
                    </Link>

                    <Link
                      to="/register"
                      className="rounded-lg bg-accent px-5 py-3 text-center font-body text-sm font-semibold text-dark"
                    >
                      Get Started
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={getDashboard()}
                      className={`rounded-lg border px-5 py-3 text-center font-body text-sm font-semibold ${mutedButtonClass}`}
                    >
                      {dashboardLabel}
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-lg bg-accent px-5 py-3 font-body text-sm font-semibold text-dark"
                    >
                      Logout
                    </button>
                  </>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
