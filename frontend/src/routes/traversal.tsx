import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { File, Folder, Route as RouteIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTraversal } from "@/hooks/use-api";
import type { TraversalType } from "@/lib/types";

export const Route = createFileRoute("/traversal")({
  component: TraversalPage,
});

function TraversalPage() {
  const [type, setType] = useState<TraversalType>("DFS");
  const q = useTraversal(type);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Recorridos del árbol</h1>
        <p className="text-sm text-muted-foreground">
          Visualiza el orden en que se visitan los nodos usando DFS o BFS.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <RouteIcon className="h-4 w-4" /> Recorrido {type}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Tabs value={type} onValueChange={(v) => setType(v as TraversalType)}>
              <TabsList>
                <TabsTrigger value="DFS">DFS</TabsTrigger>
                <TabsTrigger value="BFS">BFS</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" onClick={() => q.refetch()}>
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {q.isLoading ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : q.isError ? (
            <p className="text-sm text-destructive">{(q.error as Error).message}</p>
          ) : !q.data || q.data.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay nodos para mostrar.
            </p>
          ) : (
            <ol className="grid gap-2 sm:grid-cols-2">
              {q.data.map((n, i) => (
                <li
                  key={n.id}
                  className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/40"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-sm font-semibold text-primary">
                    {i + 1}
                  </span>
                  {n.type === "FILE" ? (
                    <File className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Folder className="h-4 w-4 text-primary" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{n.name}</p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {n.id}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {n.type}
                  </Badge>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
