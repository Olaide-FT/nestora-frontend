import { Routes, Route } from "react-router-dom";

// Public pages
import Home from "../pages/public/Home";
import Properties from "../pages/public/Properties";
import PropertyDetails from "../pages/public/PropertyDetails";
import SellerProfile from "../pages/public/SellerProfile";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import Unauthorized from "../pages/public/Unauthorized";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";

// Buyer
import Favorites from "../pages/buyer/Favorites";
import BuyerMessages from "../pages/buyer/BuyerMessages";
import BuyerProfile from "../pages/buyer/BuyerProfile";
import BuyerDashboard from "../pages/buyer/BuyerDashboard";

// Owner
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import AddProperty from "../pages/owner/AddProperty";
import MyProperties from "../pages/owner/MyProperties";
import EditProperty from "../pages/owner/EditProperty";
import OwnerInquiries from "../pages/owner/OwnerInquiries";
import OwnerProfile from "../pages/owner/OwnerProfile";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageProperties from "../pages/admin/ManageProperties";
import ManageUsers from "../pages/admin/ManageUsers";
import PropertyModeration from "../pages/admin/PropertyModeration";
import AdminProfile from "../pages/admin/AdminProfile";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import OwnerLayout from "../layouts/OwnerLayout";
import AdminLayout from "../layouts/AdminLayout";

// Route protection
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import ScrollToTop from "../components/common/ScrollToTop";


function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>

      {/* PUBLIC ROUTES*/}

      <Route element={<PublicLayout />}>

        <Route path="/" element={<Home />}/>

        <Route path="/properties" element={<Properties />}/>

        <Route path="/properties/:id" element={<PropertyDetails />} />

        <Route path="/sellers/:id" element={<SellerProfile />} />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

      </Route>


      {/* AUTHENTICATION ROUTES */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
       path="/verify-email"
       element={<VerifyEmail />}
      />


      {/* BUYER ROUTES — use PublicLayout (Navbar + Footer, no sidebar)*/}

      <Route element={<PublicLayout />}>

        <Route element={<ProtectedRoute />}>

          <Route
            element={
              <RoleRoute
                allowedRoles={["buyer"]}
              />
            }
          >

            <Route
              path="/buyer/dashboard"
              element={<BuyerDashboard />}
            />

            <Route
              path="/buyer/profile"
              element={<BuyerProfile />}
            />

            <Route
              path="/buyer/favorites"
              element={<Favorites />}
            />

            <Route
              path="/buyer/messages"
              element={<BuyerMessages />}
            />

          </Route>

        </Route>

      </Route>


      <Route element={<ProtectedRoute />}>

        {/*OWNER ROUT */}

        <Route
          element={
            <RoleRoute
              allowedRoles={["owner"]}
            />
          }
        >

          <Route element={<OwnerLayout />}>

            <Route
              path="/owner/dashboard"
              element={<OwnerDashboard />}
            />

            <Route
              path="/owner/profile"
              element={<OwnerProfile />}
            />

            <Route
              path="/owner/properties"
              element={<MyProperties />}
            />

            <Route
              path="/owner/properties/add"
              element={<AddProperty />}
            />

            <Route
              path="/owner/properties/:id/edit"
              element={<EditProperty />}
            />

            <Route
              path="/owner/inquiries"
              element={<OwnerInquiries />}
            />

          </Route>

        </Route>


        {/* ADMIN ROUTES */}

        <Route
          element={
            <RoleRoute
              allowedRoles={["admin"]}
            />
          }
        >

          <Route element={<AdminLayout />}>

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/profile"
              element={<AdminProfile />}
            />

            <Route
              path="/admin/properties"
              element={<ManageProperties />}
            />

            <Route
              path="/admin/properties/pending"
              element={<PropertyModeration />}
            />

            <Route
              path="/admin/users"
              element={<ManageUsers />}
            />

          </Route>

        </Route>

      </Route>


      {/* {FALLBACK / ERROR} */}

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      <Route
        path="*"
        element={<Home />}
      />

      </Routes>
    </>
  );
}

export default AppRoutes;
