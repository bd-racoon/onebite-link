export interface Folder {
  id: string;
  name: string;
  linkCount: number;
}

export interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  folderId: string;
  createdAt: string;
}
