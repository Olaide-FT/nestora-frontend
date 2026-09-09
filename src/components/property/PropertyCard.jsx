import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  Heart,
} from "lucide-react";
import { useNotification } from "../../context/NotificationContext";

import { useAuth } from "../../context/AuthContext";
import { addFavorite, removeFavorite } from "../../services/favoriteService";
import { formatPrice } from "../../utils/formatPrice";

function PropertyCard({ property, initialFavorite = false }) {
  const {
    _id,
    id,
    title,
    price,
    location,
    image,
    images,
    bedrooms,
    bathrooms,
    area,
    propertyType,
    isFavorite,
  } = property;

  const propertyId = _id || id;

  const { isAuthenticated, user } = useAuth();
  const { success, error: notifyError, info } = useNotification();
  const navigate = useNavigate();
  const loc = useLocation();

  const [favorite, setFavorite] = useState(
    initialFavorite || Boolean(isFavorite)
  );
  const [favLoading, setFavLoading] = useState(false);

  const propertyImage =
    image ||
    images?.[0] ||
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80";

  // Owners should not be able to favorite properties
  const isOwner = user?.role === "owner";
  const showFavorite = !isOwner;

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      info("Sign in to save properties to your favorites.");
      navigate("/login", { state: { from: loc } });
      return;
    }

    if (favLoading) return;

    // Optimistic update
    const prev = favorite;
    setFavorite(!prev);
    setFavLoading(true);

    try {
      if (prev) {
        await removeFavorite(propertyId);
        success("Removed from favorites.");
      } else {
        await addFavorite(propertyId);
        success("Added to favorites!");
      }
    } catch (error) {
      // 409 = already in favorites — treat as favorited, don't revert
      if (error?.response?.status === 409) {
        setFavorite(true);
        info("Already in your favorites.");
      } else {
        // Revert optimistic update on real errors
        setFavorite(prev);
        notifyError("Could not update favorites. Please try again.");
      }
      console.error("Favorite toggle error:", error);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <article className="relative overflow-hidden rounded-xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/properties/${propertyId}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={propertyImage}
          alt={title || "Property"}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4">
          <span className="rounded-md bg-primary px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wide text-white">
            {propertyType || "Property"}
          </span>
        </div>

        {property.availabilityStatus && property.availabilityStatus !== "available" && (
          <div className="absolute bottom-4 left-4">
            <span className="rounded-md bg-dark/85 px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wide text-white">
              {property.availabilityStatus}
            </span>
          </div>
        )}

      </div>

      <div className="p-5">
        <p className="flex items-center gap-1.5 font-body text-xs text-primary/50">
          <MapPin size={14} />
          {location || "Lagos, Nigeria"}
        </p>

        <h3 className="mt-2 line-clamp-2 font-body text-lg font-semibold text-primary">
          {title || "Beautiful Property"}
        </h3>

        <p className="mt-3 font-heading text-2xl font-bold text-primary">
          {formatPrice(price)}
        </p>

        <div className="mt-5 flex items-center gap-4 border-t border-primary/10 pt-4 font-body text-xs text-primary/60">
          {bedrooms !== undefined && (
            <span className="flex items-center gap-1.5">
              <BedDouble size={15} />
              {bedrooms} Beds
            </span>
          )}

          {bathrooms !== undefined && (
            <span className="flex items-center gap-1.5">
              <Bath size={15} />
              {bathrooms} Baths
            </span>
          )}

          {area && (
            <span className="flex items-center gap-1.5">
              <Maximize size={15} />
              {area}
            </span>
          )}
        </div>
      </div>
      </Link>

      {showFavorite && (
        <button
          type="button"
          onClick={handleFavorite}
          disabled={favLoading}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full shadow transition ${
            favorite
              ? "bg-white text-red-500"
              : "bg-white/80 text-primary/40 hover:text-red-400"
          }`}
        >
          <Heart size={16} fill={favorite ? "currentColor" : "none"} />
        </button>
      )}
    </article>
  );
}

export default PropertyCard;
