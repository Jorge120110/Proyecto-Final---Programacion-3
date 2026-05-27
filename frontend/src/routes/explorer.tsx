import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FolderPlus, Search, RefreshCw, Crosshair } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TreeNodeView } from "@/components/tree-node-view";
import { NodeDetailsPanel } from "@/components/node-details-panel";
import { CreateNodeDialog } from "@/components/create-node-dialog";
import {
  useCreateChild,
  useCreateRoot,
  usePath,
  useTree,
} from "@/hooks/use-api";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { TreeNode } from "@/lib/types";

export const Route = createFileRoute("/explorer")({
  component: ExplorerPage,
});

function filterTree(node: TreeNode, q: string): TreeNode | null {
  const match = node.name.toLowerCase().includes(q);
  const children = (node.children ?? [])
    .map((c) => filterTree(c, q))
    .filter(Boolean) as TreeNode[];
  if (match || children.length) return { ...node, children };
  return null;
}

function findNode(node: TreeNode | undefined, id: string): TreeNode | null {
  if (!node) return null;
  if (node.id === id) return node;
  for (const c of node.children ?? []) {
    const f = findNode(c, id);
    if (f) return f;
  }
  return null;
}

function ExplorerPage() {
  const tree = useTree();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [subtreeFocusId, setSubtreeFocusId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [parentForChild, setParentForChild] = useState<TreeNode | null>(null);
  const [openRoot, setOpenRoot] = useState(false);

  const createRoot = useCreateRoot();
  const createChild = useCreateChild();

  const subtree = useQuery({
    queryKey: ["subtree", subtreeFocusId],
    queryFn: () => api.getSubtree(subtreeFocusId!),
    enabled: !!subtreeFocusId,
    retry: 0,
  });

  const displayedTree = subtreeFocusId ? subtree.data : tree.data;
  const filtered = useMemo(() => {
    if (!displayedTree) return null;
    if (!search.trim()) return displayedTree;
    return filterTree(displayedTree, search.trim().toLowerCase());
  }, [displayedTree, search]);

  const selectedNode = useMemo(
    () => (selectedId ? findNode(tree.data, selectedId) : null),
    [tree.data, selectedId],
  );

  const breadcrumb = usePath(selectedId);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Explorador</h1>
          <p className="text-sm text-muted-foreground">
            Navega, expande y administra la jerarquía completa.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => tree.refetch()}>
            <RefreshCw className="mr-1 h-4 w-4" />
            Actualizar
          </Button>
          <Button onClick={() => setOpenRoot(true)}>
            <FolderPlus className="mr-1 h-4 w-4" />
            Nueva raíz
          </Button>
        </div>
      </div>

      {selectedNode && breadcrumb.data && breadcrumb.data.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb.data.map((n, i, arr) => (
              <span key={n.id} className="flex items-center">
                <BreadcrumbItem>
                  {i < arr.length - 1 ? (
                    <BreadcrumbLink
                      className="cursor-pointer"
                      onClick={() => setSelectedId(n.id)}
                    >
                      {n.name}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{n.name}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {i < arr.length - 1 && <BreadcrumbSeparator />}
              </span>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="flex min-h-[500px] flex-col">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-base">
              {subtreeFocusId ? "Subárbol enfocado" : "Árbol completo"}
            </CardTitle>
            <div className="flex items-center gap-2">
              {subtreeFocusId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSubtreeFocusId(null)}
                >
                  Ver árbol completo
                </Button>
              )}
              {selectedId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubtreeFocusId(selectedId)}
                  disabled={subtreeFocusId === selectedId}
                >
                  <Crosshair className="mr-1 h-3.5 w-3.5" />
                  Enfocar subárbol
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar nodos por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex-1 overflow-auto rounded-md border bg-card/30 p-2">
              {tree.isLoading || (subtreeFocusId && subtree.isLoading) ? (
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-7 w-full" />
                  ))}
                </div>
              ) : tree.isError ? (
                <ApiError
                  message={(tree.error as Error).message}
                  onCreateRoot={() => setOpenRoot(true)}
                />
              ) : !displayedTree ? (
                <EmptyTree onCreate={() => setOpenRoot(true)} />
              ) : !filtered ? (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  Sin coincidencias para "{search}".
                </p>
              ) : (
                <TreeNodeView
                  node={filtered}
                  selectedId={selectedId}
                  onSelect={(n) => setSelectedId(n.id)}
                  onAddChild={(n) => setParentForChild(n)}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <NodeDetailsPanel
          node={selectedNode}
          onAddChild={(n) => setParentForChild(n)}
        />
      </div>

      <CreateNodeDialog
        open={openRoot}
        onOpenChange={setOpenRoot}
        title="Crear nodo raíz"
        description="Inicializa una nueva jerarquía."
        allowTypeSelect={false}
        defaultType="FOLDER"
        submitting={createRoot.isPending}
        onSubmit={async ({ name }) => {
          try {
            await createRoot.mutateAsync({ name, type: "FOLDER" });
            toast.success("Raíz creada");
            setOpenRoot(false);
          } catch (e) {
            toast.error("No se pudo crear la raíz", {
              description: (e as Error).message,
            });
          }
        }}
      />

      <CreateNodeDialog
        open={!!parentForChild}
        onOpenChange={(v) => !v && setParentForChild(null)}
        title={`Agregar hijo a ${parentForChild?.name ?? ""}`}
        description="Crea una nueva carpeta o archivo dentro del nodo seleccionado."
        submitting={createChild.isPending}
        onSubmit={async ({ name, type }) => {
          if (!parentForChild) return;
          try {
            await createChild.mutateAsync({
              parentId: parentForChild.id,
              body: { name, type },
            });
            toast.success(`${type === "FILE" ? "Archivo" : "Carpeta"} creado`);
            setParentForChild(null);
          } catch (e) {
            toast.error("No se pudo crear el nodo", {
              description: (e as Error).message,
            });
          }
        }}
      />
    </div>
  );
}

function EmptyTree({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FolderPlus className="h-6 w-6" />
      </div>
      <p className="text-sm text-muted-foreground">No existe ningún nodo todavía.</p>
      <Button onClick={onCreate}>Crear raíz</Button>
    </div>
  );
}

function ApiError({
  message,
  onCreateRoot,
}: {
  message: string;
  onCreateRoot: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <p className="font-medium text-destructive">No se pudo cargar el árbol</p>
      <p className="text-xs text-muted-foreground">{message}</p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCreateRoot}>
          Crear raíz
        </Button>
      </div>
    </div>
  );
}
