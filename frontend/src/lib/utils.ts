import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function titleize(s: string): string {
  return s
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

export function normalizeString(v?: unknown): string {
  return String(v ?? "").toString().trim().toLowerCase();
}


export function matchesArrayOrString(
  cellValue: unknown,
  filterValue: unknown
): boolean {
  const cell = String(cellValue ?? "").toLowerCase();
  if (filterValue == null) return true;
  if (Array.isArray(filterValue)) {
    return (
      filterValue.length === 0 ||
      filterValue.map((v) => String(v).toLowerCase()).includes(cell)
    );
  }
  return String(filterValue).toLowerCase() === cell;
}


export async function fetchOrThrow(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const res = await fetchOrThrow(input, init);
  if (!res.ok) {
    let body: string | null = null;
    body = await res.text();

    if (res.status === 401) throw new Error('Unauthorized — please sign in');
    if (res.status === 404) throw new Error('Resource not found');
    if (res.status === 400) throw new Error(`Bad Request — ${body ?? res.statusText}`);
    if (res.status === 500) throw new Error('Server error — please try again later');

    const bodyPart = body ? `: ${body}` : '';
    throw new Error(`Network response was not ok (${res.status} ${res.statusText}${bodyPart})`);
  }

  return res;
}
