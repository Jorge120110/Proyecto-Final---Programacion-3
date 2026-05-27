export type NodeType = "FOLDER" | "FILE";

export interface FolderNode {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null;
}

export interface TreeNode extends FolderNode {
  children?: TreeNode[];
}

export interface CreateNodeRequest {
  name: string;
  type?: NodeType;
}

export interface ValidateResponse {
  valid: boolean;
  message?: string;
}

export type TraversalType = "DFS" | "BFS";
