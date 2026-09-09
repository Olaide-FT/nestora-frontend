import { useEffect, useState } from "react";
import {
  Building2,
  Trash2,
  Eye,
} from "lucide-react";

import { Link } from "react-router-dom";

import ApprovalBadge from "../../pages/admin/ApprovalBadge";
import useBodyScrollLock from "../../utils/useBodyScrollLock";

import {
  getAllAdminProperties,
  deleteAdminProperty,
} from "../../services/adminService";

function ManageProperties() {
  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    propertyId: null,
    title: "",
  });

  useBodyScrollLock(deleteModal.open);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const data =
        await getAllAdminProperties();

      setProperties(
        data?.properties ||
          data?.data ||
          data ||
          []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load properties."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdminProperty(id);

      setProperties((prev) =>
        prev.filter(
          (property) =>
            (property._id || property.id) !== id
        )
      );
      setDeleteModal({ open: false, propertyId: null, title: "" });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete property."
      );
    }
  };

  return (
    <section className="px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Platform Listings
        </p>

        <h1 className="mt-2 font-heading text-4xl font-bold text-primary">
          Manage Properties
        </h1>

        <p className="mt-2 font-body text-sm text-primary/45">
          View and manage all property listings.
        </p>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 font-body text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-xl border border-primary/10 bg-white">
          {loading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-lg bg-primary/5"
                />
              ))}
            </div>
          ) : properties.length ? (
            <div className="divide-y divide-primary/10">
              {properties.map((property) => (
                <div
                  key={
                    property._id ||
                    property.id
                  }
                  className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="hidden h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-primary/5 sm:block">
                      <img
                        src={
                          property.image ||
                          property.images?.[0] ||
                          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=500&q=80"
                        }
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-body text-sm font-semibold text-primary">
                        {property.title ||
                          "Untitled Property"}
                      </h3>

                      <p className="mt-1 font-body text-xs text-primary/40">
                        {property.location ||
                          "Location unavailable"}
                      </p>

                      <p className="mt-2 font-heading text-base font-bold text-primary">
                        {property.price ||
                          "Price on request"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <ApprovalBadge
                      status={property.approvalStatus || property.status || "pending"}
                    />

                    <Link
                      to={`/properties/${
                        property._id ||
                        property.id
                      }`}
                      className="flex h-9 items-center gap-2 rounded-lg border border-primary/10 px-3 font-body text-xs font-semibold text-primary"
                    >
                      <Eye size={14} />
                      View
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        setDeleteModal({
                          open: true,
                          propertyId: property._id || property.id,
                          title: property.title || "This property",
                        })
                      }
                      className="flex h-9 items-center gap-2 rounded-lg border border-red-100 px-3 font-body text-xs font-semibold text-red-500"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-20 text-center">
              <Building2
                size={30}
                className="mx-auto text-primary/20"
              />

              <h2 className="mt-4 font-heading text-2xl font-bold text-primary">
                No properties found
              </h2>
            </div>
          )}
        </div>

        {deleteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 px-4">
            <div className="w-full max-w-md rounded-2xl border border-primary/10 bg-white p-6 shadow-2xl shadow-primary/10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    Confirm Delete
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-bold text-primary">
                    Delete Listing
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteModal({ open: false, propertyId: null, title: "" })}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 text-primary/50 hover:bg-primary/5"
                  aria-label="Close delete confirmation"
                >
                  ×
                </button>
              </div>

              <p className="mt-4 font-body text-sm leading-6 text-primary/50">
                Are you sure you want to delete <span className="font-semibold text-primary">{deleteModal.title}</span>? This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ open: false, propertyId: null, title: "" })}
                  className="rounded-lg border border-primary/10 px-5 py-3 font-body text-sm font-semibold text-primary"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(deleteModal.propertyId)}
                  className="rounded-lg bg-red-500 px-5 py-3 font-body text-sm font-semibold text-white"
                >
                  Delete Listing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ManageProperties;