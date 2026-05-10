"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { mockTrips, mockCities, Trip, City } from "@/lib/mockData";
import {
  apiGetTrips,
  apiCreateTrip,
  apiDeleteTrip,
  ApiTrip,
} from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TripsContextValue {
  trips: Trip[];
  hydrated: boolean;
  loading: boolean;
  addCityToTrip: (tripId: string, city: City) => void;
  removeTrip: (tripId: string) => void;
  addTrip: (trip: Trip) => void;
  getCitiesForTrip: (tripId: string) => string[];
  isCityInAnyTrip: (cityId: string) => boolean;
  getTripForCity: (cityId: string) => Trip | undefined;
  refreshTrips: () => Promise<void>;
}

const TripsContext = createContext<TripsContextValue | null>(null);
const STORAGE_KEY = "traveloop_trips";

// ─── Converter: ApiTrip → frontend Trip ──────────────────────────────────────

function apiTripToTrip(t: ApiTrip): Trip {
  return {
    id: String(t.id),
    name: t.title,
    description: t.description || "",
    coverImage:
      t.cover_photo ||
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
    startDate: t.start_date || new Date().toISOString().split("T")[0],
    endDate: t.end_date || new Date().toISOString().split("T")[0],
    destinations: [],
    status: "upcoming" as const,
    totalBudget: 0,
    spentBudget: 0,
    stops: [],
    slug: t.share_token || String(t.id),
    isPublic: t.is_public,
    tags: [],
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function TripsProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get backend token from session
  const backendToken = (
    session?.user as (typeof session.user & { backendToken?: string }) | undefined
  )?.backendToken;

  // ── Load trips ──────────────────────────────────────────────────────────────

  const refreshTrips = useCallback(async () => {
    if (!backendToken) return;
    setLoading(true);
    try {
      const apiTrips = await apiGetTrips(backendToken);
      // Merge API trips with any locally-stored extra data (destinations, stops)
      const stored = (() => {
        try {
          const s = localStorage.getItem(STORAGE_KEY);
          return s ? (JSON.parse(s) as Trip[]) : [];
        } catch {
          return [];
        }
      })();

      const merged = apiTrips.map((at) => {
        const local = stored.find((t) => t.id === String(at.id));
        const base = apiTripToTrip(at);
        return local
          ? {
              ...base,
              destinations: local.destinations ?? base.destinations,
              stops: local.stops ?? base.stops,
              totalBudget: local.totalBudget ?? base.totalBudget,
              spentBudget: local.spentBudget ?? base.spentBudget,
              tags: local.tags ?? base.tags,
              status: local.status ?? base.status,
            }
          : base;
      });

      setTrips(merged.length > 0 ? merged : []);
    } catch (err) {
      console.error("Failed to load trips from backend:", err);
      // Fall back to localStorage
      try {
        const s = localStorage.getItem(STORAGE_KEY);
        if (s) setTrips(JSON.parse(s));
      } catch {}
    } finally {
      setLoading(false);
      setHydrated(true);
    }
  }, [backendToken]);

  // Load on mount / when session changes
  useEffect(() => {
    if (status === "loading") return;

    if (backendToken) {
      refreshTrips();
    } else {
      // Not logged in — use localStorage or mockTrips
      try {
        const s = localStorage.getItem(STORAGE_KEY);
        if (s) setTrips(JSON.parse(s));
      } catch {}
      setHydrated(true);
    }
  }, [backendToken, status, refreshTrips]);

  // Persist to localStorage whenever trips change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch {}
  }, [trips, hydrated]);

  // ── Mutations ───────────────────────────────────────────────────────────────

  const addTrip = useCallback(
    async (trip: Trip) => {
      // Optimistic update
      setTrips((prev) => [trip, ...prev]);

      if (backendToken) {
        try {
          const res = await apiCreateTrip(backendToken, {
            title: trip.name,
            description: trip.description,
            cover_photo: trip.coverImage,
            start_date: trip.startDate,
            end_date: trip.endDate,
            is_public: trip.isPublic,
          });
          // Replace temp id with real backend id
          setTrips((prev) =>
            prev.map((t) =>
              t.id === trip.id ? { ...t, id: String(res.trip_id) } : t
            )
          );
        } catch (err) {
          console.error("Failed to create trip on backend:", err);
        }
      }
    },
    [backendToken]
  );

  const removeTrip = useCallback(
    async (tripId: string) => {
      setTrips((prev) => prev.filter((t) => t.id !== tripId));

      if (backendToken) {
        const numId = parseInt(tripId, 10);
        if (!isNaN(numId)) {
          try {
            await apiDeleteTrip(backendToken, numId);
          } catch (err) {
            console.error("Failed to delete trip on backend:", err);
          }
        }
      }
    },
    [backendToken]
  );

  const addCityToTrip = useCallback((tripId: string, city: City) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        if (trip.destinations.includes(city.name)) return trip;
        return {
          ...trip,
          destinations: [...trip.destinations, city.name],
          stops: [
            ...trip.stops,
            {
              id: `stop-${Date.now()}`,
              city: city.name,
              country: city.country,
              image: city.image,
              startDate: trip.startDate,
              endDate: trip.endDate,
              activities: [],
              accommodation: "",
              accommodationCost: 0,
              transportCost: 0,
            },
          ],
        };
      })
    );
  }, []);

  const getCitiesForTrip = useCallback(
    (tripId: string) => trips.find((t) => t.id === tripId)?.destinations ?? [],
    [trips]
  );

  const isCityInAnyTrip = useCallback(
    (cityId: string) => {
      const city = mockCities.find((c) => c.id === cityId);
      if (!city) return false;
      return trips.some((t) => t.destinations.includes(city.name));
    },
    [trips]
  );

  const getTripForCity = useCallback(
    (cityId: string) => {
      const city = mockCities.find((c) => c.id === cityId);
      if (!city) return undefined;
      return trips.find((t) => t.destinations.includes(city.name));
    },
    [trips]
  );

  return (
    <TripsContext.Provider
      value={{
        trips,
        hydrated,
        loading,
        addCityToTrip,
        removeTrip,
        addTrip,
        getCitiesForTrip,
        isCityInAnyTrip,
        getTripForCity,
        refreshTrips,
      }}
    >
      {children}
    </TripsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTrips() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error("useTrips must be used inside <TripsProvider>");
  return ctx;
}
