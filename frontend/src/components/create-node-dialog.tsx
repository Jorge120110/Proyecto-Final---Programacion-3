import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { NodeType } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  submitting?: boolean;
  onSubmit: (data: { name: string; type: NodeType }) => void;
  defaultType?: NodeType;
  allowTypeSelect?: boolean;
}

export function CreateNodeDialog({
  open,
  onOpenChange,
  title,
  description,
  submitting,
  onSubmit,
  defaultType = "FOLDER",
  allowTypeSelect = true,
}: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<NodeType>(defaultType);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), type });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setName("");
          setType(defaultType);
        }
      }}
    >
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                autoFocus
                placeholder="Ej. Universidad"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            {allowTypeSelect && (
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select value={type} onValueChange={(v) => setType(v as NodeType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FOLDER">Carpeta</SelectItem>
                    <SelectItem value="FILE">Archivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting || !name.trim()}>
              {submitting ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
