import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useValidate } from "@/hooks/use-api";

export const Route = createFileRoute("/validate")({
  component: ValidatePage,
});

function ValidatePage() {
  const q = useValidate();
  const ok = q.data?.valid === true;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Validación del árbol</h1>
        <p className="text-sm text-muted-foreground">
          Comprueba que la estructura no contiene ciclos ni inconsistencias.
        </p>
      </div>

      <Card
        className={
          q.isLoading || q.isError
            ? ""
            : ok
              ? "border-success/30 bg-success/5"
              : "border-destructive/30 bg-destructive/5"
        }
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-base">
            {ok ? (
              <ShieldCheck className="h-5 w-5 text-success" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-destructive" />
            )}
            Estado de validación
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => q.refetch()}>
            Volver a validar
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {q.isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : q.isError ? (
            <p className="text-sm text-destructive">{(q.error as Error).message}</p>
          ) : (
            <>
              <p className={"text-3xl font-semibold " + (ok ? "text-success" : "text-destructive")}>
                {ok ? "Árbol válido" : "Árbol inválido"}
              </p>
              {q.data?.message && (
                <p className="text-sm text-muted-foreground">{q.data.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Endpoint: <code className="font-mono">GET /tree/validate</code>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
