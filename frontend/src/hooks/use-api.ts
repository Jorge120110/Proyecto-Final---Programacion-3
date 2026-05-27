import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CreateNodeRequest, TraversalType } from "@/lib/types";

export const qk = {
  tree: ["tree"] as const,
  subtree: (id: string) => ["tree", id] as const,
  path: (id: string) => ["path", id] as const,
  depth: (id: string) => ["depth", id] as const,
  ancestors: (id: string) => ["ancestors", id] as const,
  height: ["height"] as const,
  traversal: (t: TraversalType) => ["traversal", t] as const,
  validate: ["validate"] as const,
};

export const useTree = () =>
  useQuery({ queryKey: qk.tree, queryFn: () => api.getTree(), retry: 0 });

export const useHeight = () =>
  useQuery({ queryKey: qk.height, queryFn: () => api.getHeight(), retry: 0 });

export const useValidate = () =>
  useQuery({ queryKey: qk.validate, queryFn: () => api.validate(), retry: 0 });

export const usePath = (id?: string | null) =>
  useQuery({
    queryKey: qk.path(id ?? ""),
    queryFn: () => api.getPath(id!),
    enabled: !!id,
    retry: 0,
  });

export const useDepth = (id?: string | null) =>
  useQuery({
    queryKey: qk.depth(id ?? ""),
    queryFn: () => api.getDepth(id!),
    enabled: !!id,
    retry: 0,
  });

export const useAncestors = (id?: string | null) =>
  useQuery({
    queryKey: qk.ancestors(id ?? ""),
    queryFn: () => api.getAncestors(id!),
    enabled: !!id,
    retry: 0,
  });

export const useTraversal = (type: TraversalType) =>
  useQuery({
    queryKey: qk.traversal(type),
    queryFn: () => api.getTraversal(type),
    retry: 0,
  });

export const useCreateRoot = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateNodeRequest) => api.createRoot(body),
    onSuccess: () => qc.invalidateQueries(),
  });
};

export const useCreateChild = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { parentId: string; body: CreateNodeRequest }) =>
      api.createChild(vars.parentId, vars.body),
    onSuccess: () => qc.invalidateQueries(),
  });
};
