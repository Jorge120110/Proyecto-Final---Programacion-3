import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronRight,
  FlaskConical,
  Loader2,
  Play,
  Send,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api, getBaseUrl } from "@/lib/api";
import type { NodeType, TraversalType } from "@/lib/types";

export const Route = createFileRoute("/playground")({
  component: PlaygroundPage,
});

type RunState<T = unknown> = {
  loading: boolean;
  data?: T;
  error?: string;
  startedAt?: number;
  durationMs?: number;
  status?: "success" | "error";
};

function useRunner<T = unknown>() {
  const [state, setState] = useState<RunState<T>>({ loading: false });
  const run = async (fn: () => Promise<T>, label?: string) => {
    setState({ loading: true, startedAt: Date.now() });
    const t0 = performance.now();
    try {
      const data = await fn();
      const dur = Math.round(performance.now() - t0);
      setState({ loading: false, data, durationMs: dur, status: "success" });
      if (label) toast.success(`${label} — ${dur}ms`);
      return data;
    } catch (e) {
      const msg = (e as Error).message ?? "Error";
      const dur = Math.round(performance.now() - t0);
      setState({ loading: false, error: msg, durationMs: dur, status: "error" });
      if (label) toast.error(`${label} falló: ${msg}`);
      throw e;
    }
  };
  return { state, run, reset: () => setState({ loading: false }) };
}

function MethodBadge({ method }: { method: "GET" | "POST" }) {
  const cls =
    method === "GET"
      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  return (
    <Badge variant="outline" className={`font-mono text-[10px] ${cls}`}>
      {method}
    </Badge>
  );
}

function ResponsePanel({ state }: { state: RunState }) {
  if (state.loading) {
    return (
      <div className="flex items-center gap-2 rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Ejecutando...
      </div>
    );
  }
  if (state.error) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
        <div className="mb-1 flex items-center gap-2 text-xs font-medium text-destructive">
          <Badge variant="destructive" className="text-[10px]">ERROR</Badge>
          {state.durationMs !== undefined && <span>{state.durationMs}ms</span>}
        </div>
        <p className="font-mono text-xs text-destructive">{state.error}</p>
      </div>
    );
  }
  if (state.data === undefined) {
    return (
      <div className="rounded-md border border-dashed bg-muted/20 p-3 text-center text-xs text-muted-foreground">
        Sin respuesta aún. Ejecuta la petición.
      </div>
    );
  }
  return (
    <div className="rounded-md border bg-muted/20">
      <div className="flex items-center justify-between border-b px-3 py-1.5">
        <Badge variant="outline" className="border-success/30 bg-success/10 text-[10px] text-success">
          200 OK
        </Badge>
        {state.durationMs !== undefined && (
          <span className="font-mono text-[10px] text-muted-foreground">{state.durationMs}ms</span>
        )}
      </div>
      <ScrollArea className="max-h-72">
        <pre className="p-3 font-mono text-xs leading-relaxed">
          {JSON.stringify(state.data, null, 2)}
        </pre>
      </ScrollArea>
    </div>
  );
}

function EndpointCard({
  method,
  path,
  title,
  description,
  children,
}: {
  method: "GET" | "POST";
  path: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <MethodBadge method={method} />
          <code className="font-mono text-xs text-muted-foreground">{path}</code>
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

function PlaygroundPage() {
  const qc = useQueryClient();
  const baseUrl = getBaseUrl();

  // 1. POST /nodes/root
  const rootRunner = useRunner();
  const [rootName, setRootName] = useState("");
  const [rootType, setRootType] = useState<NodeType>("FOLDER");

  // 2. POST /nodes/{parentId}/children
  const childRunner = useRunner();
  const [parentId, setParentId] = useState("");
  const [childName, setChildName] = useState("");
  const [childType, setChildType] = useState<NodeType>("FOLDER");

  // 3. GET /tree
  const treeRunner = useRunner();

  // 4. GET /tree/{nodeId}
  const subtreeRunner = useRunner();
  const [subtreeId, setSubtreeId] = useState("");

  // 5. GET /nodes/{nodeId}/path
  const pathRunner = useRunner<Array<{ id: string; name: string }>>();
  const [pathId, setPathId] = useState("");

  // 6/7. Traversal
  const traversalRunner = useRunner();
  const [traversalType, setTraversalType] = useState<TraversalType>("DFS");

  // 8. GET /tree/height
  const heightRunner = useRunner<number>();

  // 9. GET /nodes/{nodeId}/depth
  const depthRunner = useRunner<number>();
  const [depthId, setDepthId] = useState("");

  // 10. GET /nodes/{nodeId}/ancestors
  const ancestorsRunner = useRunner();
  const [ancestorsId, setAncestorsId] = useState("");

  // 11. GET /tree/validate
  const validateRunner = useRunner<{ valid: boolean; message?: string }>();

  const invalidate = () => qc.invalidateQueries();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FlaskConical className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">API Playground</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Prueba visualmente todos los endpoints del backend. Base URL:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{baseUrl}</code>
        </p>
      </div>

      <Tabs defaultValue="mutations" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="mutations">Mutaciones</TabsTrigger>
          <TabsTrigger value="queries">Consultas</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        {/* MUTATIONS */}
        <TabsContent value="mutations" className="mt-4 grid gap-4 md:grid-cols-2">
          <EndpointCard
            method="POST"
            path="/nodes/root"
            title="Crear nodo raíz"
            description="Crea un nuevo nodo raíz del árbol."
          >
            <div className="grid gap-2">
              <Label htmlFor="root-name">Nombre</Label>
              <Input
                id="root-name"
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                placeholder="Ej. Universidad"
              />
            </div>
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select value={rootType} onValueChange={(v) => setRootType(v as NodeType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FOLDER">FOLDER</SelectItem>
                  <SelectItem value="FILE">FILE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              disabled={!rootName.trim() || rootRunner.state.loading}
              onClick={async () => {
                await rootRunner.run(
                  () => api.createRoot({ name: rootName.trim(), type: rootType }),
                  "Raíz creada",
                );
                invalidate();
              }}
            >
              {rootRunner.state.loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Ejecutar
            </Button>
            <ResponsePanel state={rootRunner.state} />
          </EndpointCard>

          <EndpointCard
            method="POST"
            path="/nodes/{parentId}/children"
            title="Crear hijo"
            description="Agrega un nodo hijo bajo el parentId indicado."
          >
            <div className="grid gap-2">
              <Label htmlFor="parent-id">Parent ID</Label>
              <Input
                id="parent-id"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                placeholder="UUID del nodo padre"
                className="font-mono text-xs"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="child-name">Nombre</Label>
              <Input
                id="child-name"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Ej. Facultad de Ingeniería"
              />
            </div>
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select value={childType} onValueChange={(v) => setChildType(v as NodeType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FOLDER">FOLDER</SelectItem>
                  <SelectItem value="FILE">FILE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              disabled={!parentId.trim() || !childName.trim() || childRunner.state.loading}
              onClick={async () => {
                await childRunner.run(
                  () =>
                    api.createChild(parentId.trim(), {
                      name: childName.trim(),
                      type: childType,
                    }),
                  "Hijo creado",
                );
                invalidate();
              }}
            >
              {childRunner.state.loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Ejecutar
            </Button>
            <ResponsePanel state={childRunner.state} />
          </EndpointCard>
        </TabsContent>

        {/* QUERIES */}
        <TabsContent value="queries" className="mt-4 grid gap-4 md:grid-cols-2">
          <EndpointCard
            method="GET"
            path="/tree"
            title="Árbol completo"
            description="Devuelve la estructura completa del árbol."
          >
            <Button
              className="w-full"
              variant="secondary"
              disabled={treeRunner.state.loading}
              onClick={() => treeRunner.run(() => api.getTree(), "Árbol cargado")}
            >
              <Play className="mr-2 h-4 w-4" /> Cargar árbol
            </Button>
            <ResponsePanel state={treeRunner.state} />
          </EndpointCard>

          <EndpointCard
            method="GET"
            path="/tree/{nodeId}"
            title="Subárbol"
            description="Obtiene el subárbol enraizado en el nodeId."
          >
            <div className="grid gap-2">
              <Label htmlFor="subtree-id">Node ID</Label>
              <Input
                id="subtree-id"
                value={subtreeId}
                onChange={(e) => setSubtreeId(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <Button
              className="w-full"
              variant="secondary"
              disabled={!subtreeId.trim() || subtreeRunner.state.loading}
              onClick={() =>
                subtreeRunner.run(() => api.getSubtree(subtreeId.trim()), "Subárbol cargado")
              }
            >
              <Play className="mr-2 h-4 w-4" /> Obtener
            </Button>
            <ResponsePanel state={subtreeRunner.state} />
          </EndpointCard>

          <EndpointCard
            method="GET"
            path="/nodes/{nodeId}/path"
            title="Ruta del nodo"
            description="Devuelve la ruta desde la raíz hasta el nodo."
          >
            <div className="grid gap-2">
              <Label htmlFor="path-id">Node ID</Label>
              <Input
                id="path-id"
                value={pathId}
                onChange={(e) => setPathId(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <Button
              className="w-full"
              variant="secondary"
              disabled={!pathId.trim() || pathRunner.state.loading}
              onClick={() => pathRunner.run(() => api.getPath(pathId.trim()), "Ruta obtenida")}
            >
              <Play className="mr-2 h-4 w-4" /> Obtener ruta
            </Button>
            {pathRunner.state.data && Array.isArray(pathRunner.state.data) && (
              <div className="flex flex-wrap items-center gap-1 rounded-md border bg-card p-2 text-sm">
                {pathRunner.state.data.map((n, i, arr) => (
                  <span key={n.id} className="flex items-center gap-1">
                    <span
                      className={
                        i === arr.length - 1
                          ? "rounded bg-accent px-2 py-0.5 font-medium text-accent-foreground"
                          : "rounded bg-muted px-2 py-0.5 text-muted-foreground"
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
            <ResponsePanel state={pathRunner.state} />
          </EndpointCard>

          <EndpointCard
            method="GET"
            path="/nodes/{nodeId}/ancestors"
            title="Ancestros"
            description="Lista de todos los ancestros del nodo."
          >
            <div className="grid gap-2">
              <Label htmlFor="ancestors-id">Node ID</Label>
              <Input
                id="ancestors-id"
                value={ancestorsId}
                onChange={(e) => setAncestorsId(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <Button
              className="w-full"
              variant="secondary"
              disabled={!ancestorsId.trim() || ancestorsRunner.state.loading}
              onClick={() =>
                ancestorsRunner.run(
                  () => api.getAncestors(ancestorsId.trim()),
                  "Ancestros obtenidos",
                )
              }
            >
              <Play className="mr-2 h-4 w-4" /> Obtener
            </Button>
            <ResponsePanel state={ancestorsRunner.state} />
          </EndpointCard>
        </TabsContent>

        {/* ANALYTICS */}
        <TabsContent value="analytics" className="mt-4 grid gap-4 md:grid-cols-2">
          <EndpointCard
            method="GET"
            path="/tree/traversal?type=DFS|BFS"
            title="Recorrido del árbol"
            description="Visita los nodos en orden DFS o BFS."
          >
            <div className="flex gap-2">
              <Button
                variant={traversalType === "DFS" ? "default" : "outline"}
                className="flex-1"
                onClick={() => {
                  setTraversalType("DFS");
                  traversalRunner.run(() => api.getTraversal("DFS"), "DFS completado");
                }}
                disabled={traversalRunner.state.loading}
              >
                DFS
              </Button>
              <Button
                variant={traversalType === "BFS" ? "default" : "outline"}
                className="flex-1"
                onClick={() => {
                  setTraversalType("BFS");
                  traversalRunner.run(() => api.getTraversal("BFS"), "BFS completado");
                }}
                disabled={traversalRunner.state.loading}
              >
                BFS
              </Button>
            </div>
            {Array.isArray(traversalRunner.state.data) && (
              <ol className="space-y-1">
                {(traversalRunner.state.data as Array<{ id: string; name: string; type: string }>).map(
                  (n, i) => (
                    <li
                      key={n.id}
                      className="flex items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-sm"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 font-mono text-xs font-semibold text-primary">
                        {i + 1}
                      </span>
                      <span className="font-medium">{n.name}</span>
                      <Badge variant="outline" className="ml-auto text-[10px]">
                        {n.type}
                      </Badge>
                    </li>
                  ),
                )}
              </ol>
            )}
            <ResponsePanel state={traversalRunner.state} />
          </EndpointCard>

          <EndpointCard
            method="GET"
            path="/tree/height"
            title="Altura del árbol"
            description="Profundidad máxima del árbol."
          >
            <Button
              className="w-full"
              variant="secondary"
              disabled={heightRunner.state.loading}
              onClick={() => heightRunner.run(() => api.getHeight(), "Altura calculada")}
            >
              <Play className="mr-2 h-4 w-4" /> Calcular altura
            </Button>
            {typeof heightRunner.state.data === "number" && (
              <div className="rounded-md border bg-primary/5 p-4 text-center">
                <p className="text-xs uppercase text-muted-foreground">Altura</p>
                <p className="text-4xl font-bold tabular-nums text-primary">
                  {heightRunner.state.data}
                </p>
              </div>
            )}
            <ResponsePanel state={heightRunner.state} />
          </EndpointCard>

          <EndpointCard
            method="GET"
            path="/nodes/{nodeId}/depth"
            title="Profundidad del nodo"
          >
            <div className="grid gap-2">
              <Label htmlFor="depth-id">Node ID</Label>
              <Input
                id="depth-id"
                value={depthId}
                onChange={(e) => setDepthId(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <Button
              className="w-full"
              variant="secondary"
              disabled={!depthId.trim() || depthRunner.state.loading}
              onClick={() =>
                depthRunner.run(() => api.getDepth(depthId.trim()), "Profundidad obtenida")
              }
            >
              <Play className="mr-2 h-4 w-4" /> Obtener
            </Button>
            {typeof depthRunner.state.data === "number" && (
              <div className="rounded-md border bg-primary/5 p-4 text-center">
                <p className="text-xs uppercase text-muted-foreground">Profundidad</p>
                <p className="text-4xl font-bold tabular-nums text-primary">
                  {depthRunner.state.data}
                </p>
              </div>
            )}
            <ResponsePanel state={depthRunner.state} />
          </EndpointCard>

          <EndpointCard
            method="GET"
            path="/tree/validate"
            title="Validar árbol"
            description="Comprueba que la estructura no contiene ciclos."
          >
            <Button
              className="w-full"
              variant="secondary"
              disabled={validateRunner.state.loading}
              onClick={() => validateRunner.run(() => api.validate(), "Validación completada")}
            >
              <Play className="mr-2 h-4 w-4" /> Validar
            </Button>
            {validateRunner.state.data && (
              <div
                className={`rounded-md border p-3 ${
                  validateRunner.state.data.valid
                    ? "border-success/30 bg-success/5"
                    : "border-destructive/30 bg-destructive/5"
                }`}
              >
                <p
                  className={`text-lg font-semibold ${
                    validateRunner.state.data.valid ? "text-success" : "text-destructive"
                  }`}
                >
                  {validateRunner.state.data.valid ? "Árbol válido" : "Árbol inválido"}
                </p>
                {validateRunner.state.data.message && (
                  <p className="text-xs text-muted-foreground">{validateRunner.state.data.message}</p>
                )}
              </div>
            )}
            <ResponsePanel state={validateRunner.state} />
          </EndpointCard>
        </TabsContent>
      </Tabs>

      <Separator />
      <p className="text-center text-xs text-muted-foreground">
        Todas las peticiones se ejecutan contra <code className="font-mono">{baseUrl}</code>
      </p>
    </div>
  );
}
