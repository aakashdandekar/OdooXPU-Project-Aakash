// ─── API Client ───────────────────────────────────────────────────────────────
// Calls the FastAPI backend at :8000.
// The backend JWT comes from the NextAuth session (stored in the JWT token).

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Base fetch ────────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  token: string | null,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }

  return res.json() as Promise<T>;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export async function apiMe(token: string): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/auth/me", token);
}

// ── Trips ─────────────────────────────────────────────────────────────────────

export interface ApiTrip {
  id: number;
  title: string;
  description: string | null;
  cover_photo: string | null;
  start_date: string | null;
  end_date: string | null;
  is_public: boolean;
  share_token: string | null;
  created_at: string | null;
}

export async function apiGetTrips(token: string): Promise<ApiTrip[]> {
  const data = await apiFetch<{ trips: ApiTrip[] }>("/api/trips", token);
  return data.trips;
}

export async function apiGetTrip(token: string, id: number): Promise<ApiTrip> {
  return apiFetch<ApiTrip>(`/api/trips/${id}`, token);
}

export async function apiCreateTrip(
  token: string,
  trip: {
    title: string;
    description?: string;
    cover_photo?: string;
    start_date?: string;
    end_date?: string;
    is_public?: boolean;
  }
): Promise<{ message: string; trip_id: number }> {
  return apiFetch("/api/trips", token, {
    method: "POST",
    body: JSON.stringify(trip),
  });
}

export async function apiUpdateTrip(
  token: string,
  id: number,
  updates: Partial<{
    title: string;
    description: string;
    cover_photo: string;
    start_date: string;
    end_date: string;
    is_public: boolean;
  }>
): Promise<{ message: string; updated_fields: string[] }> {
  return apiFetch(`/api/trips/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function apiDeleteTrip(
  token: string,
  id: number
): Promise<{ message: string }> {
  return apiFetch(`/api/trips/${id}`, token, { method: "DELETE" });
}

// ── Activities ────────────────────────────────────────────────────────────────

export interface ApiActivity {
  id: number;
  name: string;
  cost: number;
}

export async function apiGetActivities(token: string): Promise<ApiActivity[]> {
  const data = await apiFetch<{ activities: ApiActivity[] }>("/api/activities", token);
  return data.activities;
}

export async function apiCreateActivity(
  token: string,
  name: string,
  cost?: number
): Promise<{ message: string; activity_id: number }> {
  return apiFetch("/api/activities", token, {
    method: "POST",
    body: JSON.stringify({ name, cost }),
  });
}

export async function apiDeleteActivity(
  token: string,
  id: number
): Promise<{ message: string }> {
  return apiFetch(`/api/activities/${id}`, token, { method: "DELETE" });
}

// ── Packing Items ─────────────────────────────────────────────────────────────

export interface ApiPackingItem {
  id: number;
  label: string;
  category: string;
  is_packed: boolean;
}

export async function apiGetPackingItems(token: string): Promise<ApiPackingItem[]> {
  const data = await apiFetch<{ items: ApiPackingItem[] }>("/api/packing", token);
  return data.items;
}

export async function apiCreatePackingItem(
  token: string,
  label: string,
  category?: string
): Promise<{ message: string; item_id: number }> {
  return apiFetch("/api/packing", token, {
    method: "POST",
    body: JSON.stringify({ label, category: category || "other", is_packed: false }),
  });
}

export async function apiTogglePackingItem(
  token: string,
  id: number
): Promise<{ message: string; is_packed: boolean }> {
  return apiFetch(`/api/packing/${id}`, token, { method: "PATCH" });
}

export async function apiDeletePackingItem(
  token: string,
  id: number
): Promise<{ message: string }> {
  return apiFetch(`/api/packing/${id}`, token, { method: "DELETE" });
}
