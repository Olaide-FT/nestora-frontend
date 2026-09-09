import { useEffect, useState } from "react";
import { Building2, Plus } from "lucide-react";

import { Link } from "react-router-dom";

import OwnerPropertyCard from "../../pages/owner/OwnerPropertyCard";
import useBodyScrollLock from "../../utils/useBodyScrollLock";

import {
  getMyProperties,
  deleteProperty,
  updateAvailabilityStatus,
} from "../../services/ownerPropertyService";

function MyProperties() {
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
      setLoading(true);

      const data = await getMyProperties();

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
          "Unable to load your properties."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId) => {
    try {
      await deleteProperty(propertyId);

      setProperties((prev) =>
        prev.filter(
          (property) =>
            (property._id || property.id) !==
            propertyId
        )
      );
      setDeleteModal({ open: false, propertyId: null, title: "" });
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to delete property."
      );
    }
  };

  const handleAvailabilityChange = async (propertyId, availabilityStatus) => {
    try {
      setError("");
      const data = await updateAvailabilityStatus(propertyId, availabilityStatus);
      const updatedProperty = data.property;
      setProperties((current) => current.map((property) => (
        (property._id || property.id) === propertyId ? updatedProperty : property
      )));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update property availability."
      );
      fetchProperties();
    }
  };

  return (
    <section className="px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Listings
            </p>

            <h1 className="mt-2 font-heading text-4xl font-bold text-primary">
              My Properties
            </h1>

            <p className="mt-2 font-body text-sm text-primary/45">
              Manage everything you've listed on Nestora.
            </p>
          </div>

          <Link
            to="/owner/properties/add"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-body text-sm font-semibold text-white"
          >
            <Plus size={17} />
            Add Property
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 font-body text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-xl bg-white"
              >
                <div className="aspect-[16/10] bg-primary/10" />

                <div className="space-y-3 p-5">
                  <div className="h-3 w-1/3 bg-primary/10" />
                  <div className="h-5 w-2/3 bg-primary/10" />
                  <div className="h-5 w-1/2 bg-primary/10" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <OwnerPropertyCard
                key={property._id || property.id}
                property={property}
                onAvailabilityChange={handleAvailabilityChange}
                onDelete={(id) =>
                  setDeleteModal({
                    open: true,
                    propertyId: id,
                    title: property.title || "This property",
                  })
                }
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-xl border border-primary/10 bg-white px-6 py-20 text-center">
            <Building2
              size={30}
              className="mx-auto text-primary/20"
            />

            <h2 className="mt-4 font-heading text-2xl font-bold text-primary">
              No properties listed
            </h2>

            <p className="mt-2 font-body text-sm text-primary/40">
              Add your first property to start building your portfolio.
            </p>

            <Link
              to="/owner/properties/add"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-body text-sm font-semibold text-white"
            >
              <Plus size={16} />
              Add Property
            </Link>
          </div>
        )}

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

export default MyProperties;
