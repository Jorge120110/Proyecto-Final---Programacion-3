import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_BASE_URL, getBaseUrl, setBaseUrl } from "@/lib/api";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [url, setUrl] = useState("");
  const qc = useQueryClient();

  useEffect(() => {
    setUrl(getBaseUrl());
  }, []);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configuración API</h1>
        <p className="text-sm text-muted-foreground">
          Define la URL base del backend que implementa el contrato OpenAPI.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">URL base del backend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setBaseUrl(url);
              qc.invalidateQueries();
              toast.success("URL guardada", { description: url });
            }}
          >
            <Label htmlFor="base">Base URL</Label>
            <Input
              id="base"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={DEFAULT_BASE_URL}
            />
            <p className="text-xs text-muted-foreground">
              Por defecto se usa <code>VITE_API_URL</code> ({DEFAULT_BASE_URL}). Esta URL se
              aplica a todas las llamadas: <code>/tree</code>, <code>/nodes/...</code>,{" "}
              <code>/strategy/switch</code>, etc.
            </p>
            <div className="flex gap-2">
              <Button type="submit">Guardar</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setUrl(DEFAULT_BASE_URL);
                  setBaseUrl(DEFAULT_BASE_URL);
                  qc.invalidateQueries();
                  toast.success("URL restaurada al valor por defecto");
                }}
              >
                Restaurar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
