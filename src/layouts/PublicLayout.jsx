import { Outlet } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useLocation } from "react-router-dom";

function PublicLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className={isHomePage ? "" : "pt-28"}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default PublicLayout;