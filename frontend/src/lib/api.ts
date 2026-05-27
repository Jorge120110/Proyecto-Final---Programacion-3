import type {
  CreateNodeRequest,
  FolderNode,
  TraversalType,
  TreeNode,
  ValidateResponse,
} from "./types";

const BASE_URL_KEY = "folders_api_base_url";
export const DEFAULT_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "http://localhost:8080";

export type StrategyType = "collections" | "custom";
export type StorageType = "memory" | "mongodb" | "postgres";

export function getBaseUrl(): string {
  if (typeof window === "undefined") return DEFAULT_BASE_URL;
  return localStorage.getItem(BASE_URL_KEY) || DEFAULT_BASE_URL;
}

export function setBaseUrl(url: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BASE_URL_KEY, url.replace(/\/+$/, ""));
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const body = await res.text();
      if (body) msg += ` — ${body}`;
    } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export const api = {
  createRoot: (body: CreateNodeRequest) =>
    request<FolderNode>("/nodes/root", { method: "POST", body: JSON.stringify(body) }),
  createChild: (parentId: string, body: CreateNodeRequest) =>
    request<FolderNode>(`/nodes/${encodeURIComponent(parentId)}/children`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getTree: () => request<TreeNode>("/tree"),
  getSubtree: (nodeId: string) =>
    request<TreeNode>(`/tree/${encodeURIComponent(nodeId)}`),
  getPath: (nodeId: string) =>
    request<FolderNode[]>(`/nodes/${encodeURIComponent(nodeId)}/path`),
  getTraversal: (type: TraversalType) =>
    request<FolderNode[]>(`/tree/traversal?type=${type}`),
  getHeight: () => request<number>("/tree/height"),
  getDepth: (nodeId: string) =>
    request<number>(`/nodes/${encodeURIComponent(nodeId)}/depth`),
  getAncestors: (nodeId: string) =>
    request<FolderNode[]>(`/nodes/${encodeURIComponent(nodeId)}/ancestors`),
  validate: () => request<ValidateResponse>("/tree/validate"),
  switchStrategy: (strategy: StrategyType) =>
    request<unknown>("/strategy/switch", {
      method: "POST",
      body: JSON.stringify({ strategy }),
    }),
  switchStorage: (storage: StorageType) =>
    request<unknown>("/storage/switch", {
      method: "POST",
      body: JSON.stringify({ storage }),
    }),
};

const STRATEGY_KEY = "folders_api_strategy";
export function getStrategy(): StrategyType {
  if (typeof window === "undefined") return "collections";
  return (localStorage.getItem(STRATEGY_KEY) as StrategyType) || "collections";
}
export function setStrategy(s: StrategyType) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STRATEGY_KEY, s);
}

const STORAGE_KEY = "folders_api_storage";
export function getStorage(): StorageType {
  if (typeof window === "undefined") return "memory";
  return (localStorage.getItem(STORAGE_KEY) as StorageType) || "memory";
}
export function setStorage(s: StorageType) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, s);
}
