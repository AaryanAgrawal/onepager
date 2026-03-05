export interface SavedFile {
  id: string;
  name: string;
  createdAt: string;
  hasPDF: boolean;
  hasHTML: boolean;
  htmlFile: string | null;
}

export interface EditableField {
  name: string;
  value: string;
  tag: string;
}

export interface TreeNode {
  name: string;
  type: 'folder' | 'document';
  children?: TreeNode[];
  path?: string;
  pageCount?: number;
}

export interface DocumentTree {
  version: number;
  root: TreeNode[];
}
