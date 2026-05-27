import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Database, Check, Loader2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, getStorage, setStorage, type StorageType } from "@/lib/api";

const ENGINES: { value: StorageType; label: string; hint: string }[] = [
  { value: "memory", label: "Memory", hint: "Almacenamiento en memoria volátil" },
  { value: "mongodb", label: "MongoDB", hint: "Persistencia en documentos NoSQL" },
  { value: "postgres", label: "PostgreSQL", hint: "Persistencia relacional SQL" },
];

export function StorageSwitcher() {
  const qc = useQueryClient();
  const [current, setCurrent] = useState<StorageType>("memory");
  const [pending, setPending] = useState<StorageType | null>(null);

  useEffect(() => {
    setCurrent(getStorage());
  }, []);

  const change = async (s: StorageType) => {
    if (s === current) return;
    setPending(s);
    try {
      await api.switchStorage(s);
      setStorage(s);
      setCurrent(s);
      qc.invalidateQueries();
      toast.success("Motor de almacenamiento actualizado", {
        description: `Activo: ${s}`,
      });
    } catch (e) {
      toast.error("No se pudo cambiar el motor de almacenamiento", {
        description: (e as Error).message,
      });
    } finally {
      setPending(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Database className="h-4 w-4" />
          <span className="hidden sm:inline">Persistencia:</span>
          <Badge variant="secondary" className="font-mono text-[10px] uppercase">
            {current}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Motor de almacenamiento</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ENGINES.map((s) => (
          <DropdownMenuItem
            key={s.value}
            disabled={pending !== null}
            onSelect={(e) => {
              e.preventDefault();
              change(s.value);
            }}
            className="flex items-start gap-2"
          >
            {pending === s.value ? (
              <Loader2 className="mt-0.5 h-4 w-4 animate-spin text-primary" />
            ) : (
              <Check
                className={
                  "mt-0.5 h-4 w-4 " +
                  (s.value === current ? "opacity-100 text-primary" : "opacity-0")
                }
              />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium">{s.label}</span>
              <span className="text-xs text-muted-foreground">{s.hint}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
