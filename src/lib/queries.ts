import { createClient } from "@/utils/supabase/server";
import { Category, Prompt } from "./types";

// ─── Category helpers ──────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) return undefined;
  return data as Category;
}

// ─── Prompt helpers ────────────────────────────────────────────────────────────

export async function getAllPrompts(): Promise<Prompt[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching prompts:', error);
    return [];
  }
  
  // Transform DB fields to camelCase if needed, but I designed the schema to match
  return data.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    categoryId: p.category_id,
    categorySlug: p.category_slug,
    description: p.description,
    promptText: p.prompt_text,
    previewImage: p.preview_image,
    tags: p.tags,
    featured: p.featured,
    createdAt: p.created_at
  })) as Prompt[];
}

export async function getPromptBySlug(slug: string): Promise<Prompt | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) return undefined;
  
  const p = data;
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    categoryId: p.category_id,
    categorySlug: p.category_slug,
    description: p.description,
    promptText: p.prompt_text,
    previewImage: p.preview_image,
    tags: p.tags,
    featured: p.featured,
    createdAt: p.created_at
  } as Prompt;
}

export async function getPromptsByCategory(categorySlug: string): Promise<Prompt[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('category_slug', categorySlug)
    .order('created_at', { ascending: false });
  
  if (error) return [];
  return data.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    categoryId: p.category_id,
    categorySlug: p.category_slug,
    description: p.description,
    promptText: p.prompt_text,
    previewImage: p.preview_image,
    tags: p.tags,
    featured: p.featured,
    createdAt: p.created_at
  })) as Prompt[];
}

export async function getFeaturedPrompts(): Promise<Prompt[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });
  
  if (error) return [];
  return data.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    categoryId: p.category_id,
    categorySlug: p.category_slug,
    description: p.description,
    promptText: p.prompt_text,
    previewImage: p.preview_image,
    tags: p.tags,
    featured: p.featured,
    createdAt: p.created_at
  })) as Prompt[];
}

export async function searchPrompts(query: string): Promise<Prompt[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  
  const supabase = await createClient();
  // Simple search using ILIKE
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .or(`title.ilike.%${q}%,description.ilike.%${q}%,tags.cs.{${q}}`)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Search error:', error);
    return [];
  }
  
  return data.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    categoryId: p.category_id,
    categorySlug: p.category_slug,
    description: p.description,
    promptText: p.prompt_text,
    previewImage: p.preview_image,
    tags: p.tags,
    featured: p.featured,
    createdAt: p.created_at
  })) as Prompt[];
}

export async function getPromptsByTag(tag: string): Promise<Prompt[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .contains('tags', [tag])
    .order('created_at', { ascending: false });
  
  if (error) return [];
  return data.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    categoryId: p.category_id,
    categorySlug: p.category_slug,
    description: p.description,
    promptText: p.prompt_text,
    previewImage: p.preview_image,
    tags: p.tags,
    featured: p.featured,
    createdAt: p.created_at
  })) as Prompt[];
}

export async function getAllTags(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('prompts')
    .select('tags');
  
  if (error) return [];
  
  const tagSet = new Set<string>();
  data.forEach((p) => p.tags?.forEach((t: string) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

