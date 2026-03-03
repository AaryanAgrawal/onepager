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
