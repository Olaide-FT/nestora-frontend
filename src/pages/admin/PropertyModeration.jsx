import { useEffect, useState } from "react";
import {
  Check,
  X,
  MapPin,
  Building2,
} from "lucide-react";

import {
  getPendingProperties,
  approveProperty,
  rejectProperty,
} from "../../services/adminService";

import ApprovalBadge from "../../pages/admin/ApprovalBadge";
import { useNotification } from "../../context/NotificationContext";
import useBodyScrollLock from "../../utils/useBodyScrollLock";

function PropertyModeration() {
  const { success } = useNotification();
  const [properties, setProperties] = useState([]);

  const [loading, setLoading] = useState(true);

  const [processingId, setProcessingId] = useState(null);

  const [rejectModal, setRejectModal] = useState({
    open: false,
    propertyId: null,
    reason: "",
  });

  useBodyScrollLock(rejectModal.open);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const data = await getPendingProperties();

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
          "Unable to load pending properties."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessingId(id);
    setError("");

    try {
      const data = await approveProperty(id);
      const approvedProperty = data?.property;
      const propertyTitle = approvedProperty?.title || "The listing";

      setProperties((prev) =>
        prev.filter(
          (property) =>
            (property._id || property.id) !== id
        )
      );

      success(`${propertyTitle} is now approved and visible to buyers.`, {
        title: "Listing Approved",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to approve property."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = rejectModal.reason.trim();

    if (!reason) {
      setError("Please provide a rejection reason.");
      return;
    }

    setProcessingId(id);
    setError("");

    try {
      await rejectProperty(id, reason);

      setProperties((prev) =>
        prev.filter(
          (property) =>
            (property._id || property.id) !== id
        )
      );
      setRejectModal({ open: false, propertyId: null, reason: "" });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to reject property."
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Moderation
        </p>

        <h1 className="mt-2 font-heading text-4xl font-bold text-primary">
          Property Approvals
        </h1>

        <p className="mt-2 font-body text-sm text-primary/45">
          Review listings before they become visible to buyers.
        </p>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 font-body text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-xl bg-white"
              />
            ))}
          </div>
        ) : properties.length ? (
          <div className="mt-8 space-y-5">
            {properties.map((property) => {
              const propertyId =
                property._id ||
                property.id;

              const isProcessing =
                processingId === propertyId;
              const displayLocation =
                property.location ||
                property.address ||
                [property.city, property.state]
                  .filter(Boolean)
                  .join(", ") ||
                "Location unavailable";

              return (
                <article
                  key={propertyId}
                  className="overflow-hidden rounded-xl border border-primary/10 bg-white"
                >
                  <div className="grid lg:grid-cols-[280px_1fr]">
                    <div className="aspect-[4/3] lg:aspect-auto">
                      <img
                        src={
                          property.image ||
                          property.images?.[0] ||
                          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={
                          property.title ||
                          "Property"
                        }
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="font-heading text-2xl font-bold text-primary">
                            {property.title ||
                              "Untitled Property"}
                          </h2>

                          <p className="mt-2 flex items-center gap-1.5 font-body text-xs text-primary/40">
                            <MapPin size={13} />
                            {displayLocation}
                          </p>
                        </div>

                        <ApprovalBadge status={property.approvalStatus || property.status || "pending"} />
                      </div>

                      <p className="mt-5 font-heading text-xl font-bold text-primary">
                        {property.price ||
                          "Price on request"}
                      </p>

                      <p className="mt-4 line-clamp-3 font-body text-sm leading-6 text-primary/50">
                        {property.description ||
                          "No property description provided."}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3 border-t border-primary/10 pt-5">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() =>
                            handleApprove(
                              propertyId
                            )
                          }
                          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-body text-xs font-semibold text-white disabled:opacity-50"
                        >
                          <Check size={15} />
                          Approve
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() =>
                            setRejectModal({
                              open: true,
                              propertyId,
                              reason: "",
                            })
                          }
                          className="flex items-center gap-2 rounded-lg border border-red-100 px-5 py-3 font-body text-xs font-semibold text-red-500 disabled:opacity-50"
                        >
                          <X size={15} />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-primary/10 bg-white px-6 py-20 text-center">
            <Building2
              size={30}
              className="mx-auto text-primary/20"
            />

            <h2 className="mt-4 font-heading text-2xl font-bold text-primary">
              No pending properties
            </h2>

            <p className="mt-2 font-body text-sm text-primary/40">
              New owner listings waiting for review will appear here.
            </p>
          </div>
        )}

        {rejectModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 px-4">
            <div className="w-full max-w-lg rounded-2xl border border-primary/10 bg-white p-6 shadow-2xl shadow-primary/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    Rejection Reason
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-bold text-primary">
                    Reject Property
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setRejectModal({ open: false, propertyId: null, reason: "" })}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 text-primary/50 hover:bg-primary/5"
                  aria-label="Close rejection modal"
                >
                  ×
                </button>
              </div>

              <p className="mt-4 font-body text-sm leading-6 text-primary/50">
                Please tell the owner why this listing is being rejected.
              </p>

              <textarea
                value={rejectModal.reason}
                onChange={(e) =>
                  setRejectModal((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                rows={5}
                placeholder="e.g. Missing required details, poor image quality, or policy violation..."
                className="mt-5 w-full resize-none rounded-xl border border-primary/10 bg-background px-4 py-3 font-body text-sm text-primary outline-none focus:border-accent"
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModal({ open: false, propertyId: null, reason: "" })}
                  className="rounded-lg border border-primary/10 px-5 py-3 font-body text-sm font-semibold text-primary"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={processingId === rejectModal.propertyId || !rejectModal.reason.trim()}
                  onClick={() => handleReject(rejectModal.propertyId)}
                  className="rounded-lg bg-red-500 px-5 py-3 font-body text-sm font-semibold text-white disabled:opacity-50"
                >
                  {processingId === rejectModal.propertyId ? "Rejecting..." : "Reject Listing"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default PropertyModeration;
