import { useQuery } from "@tanstack/react-query";
import { Layers3, Database, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

export function ConfigIndicators() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["config", "current"],
    queryFn: () => api.getConfig(),
    retry: 0,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
    meta: { silent: true },
  });

  if (isError) {
    return (
      <div className="flex items-center gap-1.5 rounded-md border border-dashed px-2 py-1 text-xs text-muted-foreground">
        <WifiOff className="h-3.5 w-3.5" />
        <span>No conectado</span>
      </div>
    );
  }

  const strategy = data?.strategy ?? (isLoading ? "…" : "—");
  const storage = data?.storage ?? (isLoading ? "…" : "—");

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-1.5 rounded-md border bg-background/60 px-2 py-1"
        title="Estrategia activa (solo lectura)"
      >
        <Layers3 className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="hidden text-xs text-muted-foreground sm:inline">
          Estrategia:
        </span>
        <Badge variant="secondary" className="font-mono text-[10px] uppercase">
          {strategy}
        </Badge>
      </div>
      <div
        className="flex items-center gap-1.5 rounded-md border bg-background/60 px-2 py-1"
        title="Motor de persistencia activo (solo lectura)"
      >
        <Database className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="hidden text-xs text-muted-foreground sm:inline">
          Persistencia:
        </span>
        <Badge variant="secondary" className="font-mono text-[10px] uppercase">
          {storage}
        </Badge>
      </div>
    </div>
  );
}
