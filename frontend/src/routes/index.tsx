import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  FolderTree,
  Layers,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Plus,
  ArrowRight,
  Activity,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CreateNodeDialog } from "@/components/create-node-dialog";
import { useCreateRoot, useHeight, useTree, useValidate } from "@/hooks/use-api";
import type { TreeNode } from "@/lib/types";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function flatten(node?: TreeNode | null): TreeNode[] {
  if (!node) return [];
  const out: TreeNode[] = [node];
  (node.children ?? []).forEach((c) => out.push(...flatten(c)));
  return out;
}

function Dashboard() {
  const tree = useTree();
  const height = useHeight();
  const validate = useValidate();
  const createRoot = useCreateRoot();
  const [openCreate, setOpenCreate] = useState(false);

  const allNodes = useMemo(() => flatten(tree.data), [tree.data]);
  const folders = allNodes.filter((n) => n.type !== "FILE").length;
  const files = allNodes.filter((n) => n.type === "FILE").length;
  const recent = allNodes.slice(-6).reverse();

  const noRoot = tree.isError || !tree.data;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Vista general de la estructura jerárquica de tu organización.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setOpenCreate(true)} variant="default">
            <Plus className="mr-1 h-4 w-4" />
            {noRoot ? "Crear raíz" : "Nueva raíz"}
          </Button>
          <Button asChild variant="outline">
            <Link to="/explorer">
              Abrir explorador <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FolderTree className="h-4 w-4" />}
          title="Nodos totales"
          loading={tree.isLoading}
          value={allNodes.length}
          hint={`${folders} carpetas · ${files} archivos`}
        />
        <StatCard
          icon={<Layers className="h-4 w-4" />}
          title="Altura del árbol"
          loading={height.isLoading}
          error={height.error as Error | null}
          value={height.data ?? 0}
          hint="Distancia raíz → hoja más lejana"
        />
        <StatCard
          icon={<Sparkles className="h-4 w-4" />}
          title="Carpetas"
          loading={tree.isLoading}
          value={folders}
          hint="Contenedores con hijos potenciales"
        />
        <ValidityCard
          loading={validate.isLoading}
          error={validate.error as Error | null}
          valid={validate.data?.valid}
          message={validate.data?.message}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Vista rápida del árbol</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/explorer">Ver completo</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {tree.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-full" />
                ))}
              </div>
            ) : noRoot ? (
              <EmptyState onCreate={() => setOpenCreate(true)} message={(tree.error as Error)?.message} />
            ) : (
              <ul className="space-y-1.5 text-sm">
                {allNodes.slice(0, 12).map((n) => (
                  <li
                    key={n.id}
                    className="flex items-center gap-2 rounded-md border bg-card px-3 py-1.5"
                  >
                    <FolderTree className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium">{n.name}</span>
                    <Badge variant="outline" className="ml-auto text-[10px]">
                      {n.type}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" /> Actividad reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tree.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin actividad.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {recent.map((n) => (
                  <li key={n.id} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="font-medium">{n.name}</span>
                    <span className="ml-auto truncate font-mono text-xs text-muted-foreground">
                      {n.id}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <CreateNodeDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        title="Crear nodo raíz"
        description="Inicializa la jerarquía con una nueva carpeta raíz."
        submitting={createRoot.isPending}
        allowTypeSelect={false}
        defaultType="FOLDER"
        onSubmit={async ({ name }) => {
          try {
            await createRoot.mutateAsync({ name, type: "FOLDER" });
            toast.success("Raíz creada");
            setOpenCreate(false);
          } catch (e) {
            toast.error("No se pudo crear la raíz", {
              description: (e as Error).message,
            });
          }
        }}
      />
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  hint,
  loading,
  error,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  hint?: string;
  loading?: boolean;
  error?: Error | null;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : error ? (
          <p className="text-sm text-destructive">{error.message}</p>
        ) : (
          <>
            <div className="text-3xl font-semibold tabular-nums">{value}</div>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ValidityCard({
  loading,
  error,
  valid,
  message,
}: {
  loading?: boolean;
  error?: Error | null;
  valid?: boolean;
  message?: string;
}) {
  const ok = valid === true;
  return (
    <Card
      className={
        loading || error
          ? ""
          : ok
            ? "border-success/30 bg-success/5"
            : "border-destructive/30 bg-destructive/5"
      }
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {ok ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
          Validación
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : error ? (
          <p className="text-sm text-destructive">{error.message}</p>
        ) : (
          <>
            <div
              className={
                "text-2xl font-semibold " + (ok ? "text-success" : "text-destructive")
              }
            >
              {ok ? "Válido" : "Inválido"}
            </div>
            {message && <p className="mt-1 text-xs text-muted-foreground">{message}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState({ onCreate, message }: { onCreate: () => void; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FolderTree className="h-6 w-6" />
      </div>
      <div>
        <p className="font-medium">Aún no hay árbol</p>
        <p className="text-sm text-muted-foreground">
          {message
            ? `No se pudo conectar (${message}). Verifica la URL de la API o crea una raíz.`
            : "Crea tu primer nodo raíz para comenzar."}
        </p>
      </div>
      <Button onClick={onCreate}>
        <Plus className="mr-1 h-4 w-4" /> Crear raíz
      </Button>
    </div>
  );
}
