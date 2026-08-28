export interface Folder {
  id: string;
  name: string;
}

export interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  folderId: string;
  createdAt: string;
}
