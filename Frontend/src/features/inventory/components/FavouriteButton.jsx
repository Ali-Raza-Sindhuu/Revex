import { useState } from "react";
import { useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { focusRing } from "@/shared/styles";
import { setFavourite, useFavourites } from "../favourites";

const FavouriteButton = ({ carId, className = "" }) => {
  const { token, user } = useSelector((state) => state.auth);
  const favourites = useFavourites(token, user?.id);
  const [undo, setUndo] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [saving, setSaving] = useState(false);
  const saved = favourites.includes(carId);
  const restore = async () => {
    setSyncError("");
    try {
      await setFavourite(carId, true, token, user?.id);
      setUndo(false);
    } catch (error) {
      setSyncError(`Wishlist could not sync: ${error.message}`);
    }
  };
  const toggle = async () => {
    setSyncError("");
    setSaving(true);
    try {
      await setFavourite(carId, !saved, token, user?.id);
      setUndo(saved);
    } catch (error) {
      setSyncError(`Wishlist could not sync: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="relative z-10 flex flex-col items-center">
      <button
        type="button"
        aria-label={saved ? "Remove favourite" : "Favourite"}
        title={saved ? "Remove favourite" : "Favourite"}
        aria-pressed={saved}
        disabled={saving}
        onClick={toggle}
        className={`grid size-9 place-items-center rounded-full bg-white text-neutral-500 shadow-sm transition-colors hover:text-[#f05a1a] ${focusRing} ${className}`}
      >
        <Heart className={`size-4 ${saved ? "fill-[#f05a1a] text-[#f05a1a]" : ""}`} />
      </button>
      {undo && (
        <p role="status" className="absolute right-0 top-full mt-2 flex items-center gap-1 whitespace-nowrap rounded-lg bg-white px-2 py-1 text-[10px] text-neutral-700 shadow-lg">
          Removed from saved cars.
          <button type="button" onClick={restore} className="font-semibold text-[#f05a1a] underline">Undo</button>
        </p>
      )}
      {syncError && <p role="alert" className="mt-1 max-w-40 rounded bg-white p-1 text-center text-[10px] text-red-700">{syncError}</p>}
    </div>
  );
};

export default FavouriteButton;
