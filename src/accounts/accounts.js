// Clipper Hub — Accounts module (MVP, browser/localStorage)
// Data shape: { id, platform, handle, displayName, status, notes, createdAt, updatedAt }
const STORAGE_KEY = "clipper-hub:accounts:v1";
const PLATFORMS = ["TikTok", "Instagram", "YouTube", "Other"];
const STATUSES = ["active", "paused", "restricted"];

const readAccounts = () => {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};
const writeAccounts = (accounts) => localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));

const makeId = () => globalThis.crypto?.randomUUID?.() || `acc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export function listAccounts() {
  return readAccounts().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getAccount(id) {
  return readAccounts().find((account) => account.id === id) || null;
}

export function createAccount(input) {
  const platform = String(input.platform || "Other");
  const handle = String(input.handle || "").trim();
  if (!handle) throw new Error("Handle akun wajib diisi.");
  if (!PLATFORMS.includes(platform)) throw new Error("Platform tidak valid.");

  const now = new Date().toISOString();
  const account = {
    id: makeId(),
    platform,
    handle: handle.startsWith("@") ? handle : `@${handle}`,
    displayName: String(input.displayName || "").trim(),
    status: STATUSES.includes(input.status) ? input.status : "active",
    notes: String(input.notes || "").trim(),
    createdAt: now,
    updatedAt: now,
  };
  const accounts = readAccounts();
  accounts.push(account);
  writeAccounts(accounts);
  return account;
}

export function updateAccount(id, patch) {
  const accounts = readAccounts();
  const index = accounts.findIndex((account) => account.id === id);
  if (index < 0) throw new Error("Akun tidak ditemukan.");

  const next = { ...accounts[index], ...patch, id, updatedAt: new Date().toISOString() };
  if (!String(next.handle || "").trim()) throw new Error("Handle akun wajib diisi.");
  if (!PLATFORMS.includes(next.platform)) throw new Error("Platform tidak valid.");
  if (!STATUSES.includes(next.status)) throw new Error("Status tidak valid.");
  next.handle = next.handle.startsWith("@") ? next.handle : `@${next.handle}`;
  accounts[index] = next;
  writeAccounts(accounts);
  return next;
}

export function deleteAccount(id) {
  const accounts = readAccounts();
  const next = accounts.filter((account) => account.id !== id);
  if (next.length === accounts.length) return false;
  writeAccounts(next);
  return true;
}

export function exportAccounts() {
  return JSON.stringify({ schema: "clipper-hub/accounts-v1", exportedAt: new Date().toISOString(), accounts: readAccounts() }, null, 2);
}

export function importAccounts(json, { replace = false } = {}) {
  const parsed = JSON.parse(json);
  const incoming = Array.isArray(parsed) ? parsed : parsed.accounts;
  if (!Array.isArray(incoming)) throw new Error("Format JSON akun tidak valid.");
  for (const item of incoming) {
    if (!item || !item.id || !item.handle || !PLATFORMS.includes(item.platform) || !STATUSES.includes(item.status)) {
      throw new Error("Data akun memiliki record yang tidak valid.");
    }
  }
  const current = readAccounts();
  const merged = replace ? incoming : [...current, ...incoming.filter((item) => !current.some((old) => old.id === item.id))];
  writeAccounts(merged);
  return merged.length;
}

export const accountOptions = { platforms: PLATFORMS, statuses: STATUSES };
