import { useAncestors, useDepth, usePath } from "@/hooks/use-api";
import type { TreeNode } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, File, Folder, Hash, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  node: TreeNode | null;
  onAddChild: (node: TreeNode) => void;
}

export function NodeDetailsPanel({ node, onAddChild }: Props) {
  const path = usePath(node?.id);
  const depth = useDepth(node?.id);
  const ancestors = useAncestors(node?.id);

  if (!node) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full min-h-[400px] flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Folder className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">Ningún nodo seleccionado</p>
            <p className="text-sm text-muted-foreground">
              Selecciona un nodo del árbol para ver sus detalles.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isFolder = node.type !== "FILE";

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {isFolder ? <Folder className="h-5 w-5" /> : <File className="h-5 w-5" />}
          </div>
          <div>
            <CardTitle className="text-base">{node.name}</CardTitle>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="font-mono text-[10px]">
                {node.id}
              </Badge>
              <Badge variant={isFolder ? "default" : "outline"}>{node.type}</Badge>
              {!node.parentId && <Badge variant="outline">RAÍZ</Badge>}
            </div>
          </div>
        </div>
        {isFolder && (
          <Button size="sm" onClick={() => onAddChild(node)}>
            Nuevo hijo
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        <Section icon={<Hash className="h-4 w-4" />} title="Profundidad">
          {depth.isLoading ? (
            <Skeleton className="h-6 w-12" />
          ) : depth.isError ? (
            <ErrorText error={depth.error} />
          ) : (
            <span className="text-2xl font-semibold tabular-nums">{depth.data ?? 0}</span>
          )}
        </Section>

        <Section icon={<ChevronRight className="h-4 w-4" />} title="Ruta desde la raíz">
          {path.isLoading ? (
            <Skeleton className="h-6 w-full" />
          ) : path.isError ? (
            <ErrorText error={path.error} />
          ) : (
            <div className="flex flex-wrap items-center gap-1 text-sm">
              {(path.data ?? []).map((n, i, arr) => (
                <span key={n.id} className="flex items-center gap-1">
                  <span
                    className={
                      i === arr.length - 1
                        ? "rounded-md bg-accent px-2 py-0.5 font-medium text-accent-foreground"
                        : "rounded-md bg-muted px-2 py-0.5 text-muted-foreground"
                    }
                  >
                    {n.name}
                  </span>
                  {i < arr.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                </span>
              ))}
            </div>
          )}
        </Section>

        <Section icon={<Layers className="h-4 w-4" />} title="Ancestros">
          {ancestors.isLoading ? (
            <Skeleton className="h-6 w-full" />
          ) : ancestors.isError ? (
            <ErrorText error={ancestors.error} />
          ) : (ancestors.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin ancestros.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {ancestors.data!.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-2 rounded-md border bg-card px-2 py-1.5"
                >
                  <Folder className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium">{a.name}</span>
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {a.id}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </CardContent>
    </Card>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

function ErrorText({ error }: { error: unknown }) {
  return (
    <p className="text-sm text-destructive">
      {(error as Error)?.message ?? "Error al cargar."}
    </p>
  );
}
