import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Layers3, Check } from "lucide-react";

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
import { api, getStrategy, setStrategy, type StrategyType } from "@/lib/api";

const STRATEGIES: { value: StrategyType; label: string; hint: string }[] = [
  { value: "collections", label: "Collections", hint: "Java Collections estándar" },
  { value: "custom", label: "Custom", hint: "Implementación personalizada" },
];

export function StrategySwitcher() {
  const qc = useQueryClient();
  const [current, setCurrent] = useState<StrategyType>("collections");
  const [pending, setPending] = useState<StrategyType | null>(null);

  useEffect(() => {
    setCurrent(getStrategy());
  }, []);

  const change = async (s: StrategyType) => {
    if (s === current) return;
    setPending(s);
    try {
      await api.switchStrategy(s);
      setStrategy(s);
      setCurrent(s);
      qc.invalidateQueries();
      toast.success("Estrategia actualizada", {
        description: `Activa: ${s}`,
      });
    } catch (e) {
      toast.error("No se pudo cambiar la estrategia", {
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
          <Layers3 className="h-4 w-4" />
          <span className="hidden sm:inline">Estrategia:</span>
          <Badge variant="secondary" className="font-mono text-[10px] uppercase">
            {current}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Estrategia del árbol</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STRATEGIES.map((s) => (
          <DropdownMenuItem
            key={s.value}
            disabled={pending !== null}
            onSelect={(e) => {
              e.preventDefault();
              change(s.value);
            }}
            className="flex items-start gap-2"
          >
            <Check
              className={
                "mt-0.5 h-4 w-4 " +
                (s.value === current ? "opacity-100 text-primary" : "opacity-0")
              }
            />
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
