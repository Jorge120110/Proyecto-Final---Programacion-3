import { useState } from "react";
import { ChevronRight, File, Folder, FolderOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TreeNode } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface Props {
  node: TreeNode;
  selectedId?: string | null;
  onSelect?: (node: TreeNode) => void;
  onAddChild?: (node: TreeNode) => void;
  level?: number;
  defaultOpen?: boolean;
}

export function TreeNodeView({
  node,
  selectedId,
  onSelect,
  onAddChild,
  level = 0,
  defaultOpen = true,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const hasChildren = !!node.children && node.children.length > 0;
  const isFolder = node.type !== "FILE";
  const isSelected = selectedId === node.id;

  return (
    <div className="select-none">
      <div
        className={cn(
          "group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm transition-colors",
          "hover:bg-accent/60",
          isSelected && "bg-accent text-accent-foreground ring-1 ring-primary/30",
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <button
          type="button"
          onClick={() => isFolder && setOpen((o) => !o)}
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-transform",
            hasChildren && open && "rotate-90",
            !isFolder && "opacity-0",
          )}
          aria-label={open ? "Contraer" : "Expandir"}
        >
          {isFolder && hasChildren ? <ChevronRight className="h-4 w-4" /> : null}
        </button>

        <button
          type="button"
          onClick={() => onSelect?.(node)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          {isFolder ? (
            open && hasChildren ? (
              <FolderOpen className="h-4 w-4 text-primary" />
            ) : (
              <Folder className="h-4 w-4 text-primary" />
            )
          ) : (
            <File className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="truncate font-medium">{node.name}</span>
          {!node.parentId && (
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              raíz
            </span>
          )}
        </button>

        {isFolder && onAddChild && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
            onClick={() => onAddChild(node)}
            aria-label="Agregar hijo"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {open && hasChildren && (
        <div className="relative">
          <div
            className="absolute top-0 bottom-1 border-l border-dashed border-border"
            style={{ left: `${level * 16 + 18}px` }}
          />
          {node.children!.map((child) => (
            <TreeNodeView
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              onAddChild={onAddChild}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
