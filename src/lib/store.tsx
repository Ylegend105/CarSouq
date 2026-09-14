"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Currency } from "./types";

export interface PlacedBid {
  vehicleId: string;
  amount: number;
  at: number; // epoch ms
  status: "highest" | "outbid" | "won";
}

export interface SavedSearch {
  id: string;
  label: string;
  query: string;
  alerts: boolean;
}

export interface AppNotification {
  id: string;
  kind: "outbid" | "ending" | "won" | "document" | "payment";
  title: string;
  body: string;
  minutesAgo: number;
  read: boolean;
}

interface StoreValue {
  hydrated: boolean;
  currency: Currency;
  setCurrency: (c: Currency) => void;

  watchlist: string[];
  isWatched: (id: string) => boolean;
  toggleWatch: (id: string) => void;

  bids: PlacedBid[];
  placeBid: (vehicleId: string, amount: number) => void;

  savedSearches: SavedSearch[];
  addSavedSearch: (s: Omit<SavedSearch, "id">) => void;
  removeSavedSearch: (id: string) => void;

  notifications: AppNotification[];
  markAllRead: () => void;
  unreadCount: number;
}

const StoreContext = createContext<StoreValue | null>(null);

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    kind: "outbid",
    title: "You've been outbid on the 2020 BMW 330i",
    body: "New high bid is $24,800. Minimum next bid is $25,300.",
    minutesAgo: 8,
    read: false,
  },
  {
    id: "n2",
    kind: "ending",
    title: "Land Rover Defender 110 ends in under 3 hours",
    body: "You're watching this lot. Reserve is met.",
    minutesAgo: 46,
    read: false,
  },
  {
    id: "n3",
    kind: "document",
    title: "New document added: 2019 Prado",
    body: "The seller uploaded the timing-belt service invoice.",
    minutesAgo: 210,
    read: true,
  },
  {
    id: "n4",
    kind: "payment",
    title: "Payment reminder — 2016 Chevrolet Tahoe",
    body: "Escrow payment is due within 36 hours to complete your purchase.",
    minutesAgo: 400,
    read: true,
  },
];

const DEFAULT_SEARCHES: SavedSearch[] = [
  { id: "s1", label: "SUVs under $25k in Beirut", query: "?bodyType=SUV&priceMax=25000&location=Beirut", alerts: true },
  { id: "s2", label: "Toyota, low mileage", query: "?make=Toyota&mileageMax=60000&sort=mileage", alerts: true },
  { id: "s3", label: "Ending soon, reserve met", query: "?endingSoon=1&sort=endingSoon", alerts: false },
];

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [bids, setBids] = useState<PlacedBid[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(DEFAULT_SEARCHES);
  const [notifications, setNotifications] = useState<AppNotification[]>(DEFAULT_NOTIFICATIONS);

  useEffect(() => {
    // One-time rehydration from localStorage after mount. Reading storage during
    // render would break SSR, so the setState-in-effect pattern is intentional here.
    /* eslint-disable react-hooks/set-state-in-effect */
    setCurrencyState(load<Currency>("carsouq.currency", "USD"));
    setWatchlist(load<string[]>("carsouq.watchlist", ["003", "017"]));
    setBids(load<PlacedBid[]>("carsouq.bids", []));
    setSavedSearches(load<SavedSearch[]>("carsouq.searches", DEFAULT_SEARCHES));
    setNotifications(load<AppNotification[]>("carsouq.notifications", DEFAULT_NOTIFICATIONS));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    save("carsouq.currency", c);
  }, []);

  const toggleWatch = useCallback((id: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      save("carsouq.watchlist", next);
      return next;
    });
  }, []);

  const isWatched = useCallback((id: string) => watchlist.includes(id), [watchlist]);

  const placeBid = useCallback((vehicleId: string, amount: number) => {
    setBids((prev) => {
      const next: PlacedBid[] = [
        { vehicleId, amount, at: Date.now(), status: "highest" },
        ...prev.filter((b) => b.vehicleId !== vehicleId),
      ];
      save("carsouq.bids", next);
      return next;
    });
  }, []);

  const addSavedSearch = useCallback((s: Omit<SavedSearch, "id">) => {
    setSavedSearches((prev) => {
      const next = [{ ...s, id: `s${Date.now()}` }, ...prev];
      save("carsouq.searches", next);
      return next;
    });
  }, []);

  const removeSavedSearch = useCallback((id: string) => {
    setSavedSearches((prev) => {
      const next = prev.filter((s) => s.id !== id);
      save("carsouq.searches", next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      save("carsouq.notifications", next);
      return next;
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = useMemo<StoreValue>(
    () => ({
      hydrated,
      currency,
      setCurrency,
      watchlist,
      isWatched,
      toggleWatch,
      bids,
      placeBid,
      savedSearches,
      addSavedSearch,
      removeSavedSearch,
      notifications,
      markAllRead,
      unreadCount,
    }),
    [
      hydrated,
      currency,
      setCurrency,
      watchlist,
      isWatched,
      toggleWatch,
      bids,
      placeBid,
      savedSearches,
      addSavedSearch,
      removeSavedSearch,
      notifications,
      markAllRead,
      unreadCount,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
