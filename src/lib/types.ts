export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  count: number;
}

export interface Prompt {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categorySlug: string;
  description: string;
  promptText: string;
  previewImage: string;
  tags: string[];
  featured: boolean;
  createdAt: string;
}
