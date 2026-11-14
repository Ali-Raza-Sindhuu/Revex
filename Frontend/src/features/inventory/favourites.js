import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export const FAVOURITES_KEY = "revexSavedCars";
export const FAVOURITES_SYNC_EVENT = "revex:favourites-sync-error";
const CHANGE_EVENT = "revex:favourites-changed";
const accountWishlistLoads = new Map();
const accountKey = (userId) => userId ? `${FAVOURITES_KEY}:${userId}` : FAVOURITES_KEY;

const readIds = (userId) => {
  try {
    const stored = JSON.parse(localStorage.getItem(accountKey(userId)) || "[]");
    return Array.isArray(stored) ? [...new Set(stored.filter((id) => typeof id === "string"))] : [];
  } catch {
    return [];
  }
};

const writeIds = (ids, userId) => localStorage.setItem(accountKey(userId), JSON.stringify(ids));
const notify = () => window.dispatchEvent(new Event(CHANGE_EVENT));
export const getFavouriteIds = () => readIds();

const loadAccountWishlist = (token, userId) => {
  const key = `${userId}:${token}`;
  if (!accountWishlistLoads.has(key)) {
    const load = apiRequest("/api/wishlist", { token }).then(async ({ carIds = [] }) => {
      const guestIds = readIds();
      const merged = guestIds.length
        ? await apiRequest("/api/wishlist/merge", { method: "POST", token, body: { carIds: guestIds } })
        : { carIds };
      writeIds([], null);
      return merged.carIds ?? carIds;
    }).catch((error) => {
      accountWishlistLoads.delete(key);
      throw error;
    });
    accountWishlistLoads.set(key, load);
  }
  return accountWishlistLoads.get(key);
};

export const setFavourite = async (id, saved, token, userId) => {
  if (token && userId) writeIds(await loadAccountWishlist(token, userId), userId);
  const before = readIds(userId);
  const next = before.filter((savedId) => savedId !== id);
  if (saved) next.push(id);
  writeIds(next, userId);
  notify();
  if (!token) return next;

  try {
    const result = saved
      ? await apiRequest("/api/wishlist/items", { method: "POST", token, body: { carId: id } })
      : await apiRequest(`/api/wishlist/items/${encodeURIComponent(id)}`, { method: "DELETE", token });
    writeIds(result.carIds ?? next, userId);
    notify();
    return result.carIds ?? next;
  } catch (error) {
    writeIds(before, userId);
    notify();
    throw error;
  }
};

export const useFavourites = (token, userId) => {
  const [ids, setIds] = useState(() => readIds(userId));
  useEffect(() => {
    let active = true;
    const refresh = () => setIds(readIds(userId));
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    setIds(readIds(userId));

    if (token && userId) {
      loadAccountWishlist(token, userId)
        .then((carIds) => {
          if (!active) return;
          writeIds(carIds, userId);
          setIds(carIds);
          window.dispatchEvent(new CustomEvent(FAVOURITES_SYNC_EVENT, { detail: "" }));
          notify();
        })
        .catch((error) => {
          if (active) window.dispatchEvent(new CustomEvent(FAVOURITES_SYNC_EVENT, { detail: error.message }));
        });
    }

    return () => {
      active = false;
      window.removeEventListener(CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [token, userId]);
  return ids;
};
