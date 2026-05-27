-- Migration to create the workspace_boards table for persisting canvas states
CREATE TABLE IF NOT EXISTS workspace_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_slug TEXT NOT NULL,
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  edges JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure fast lookups by workspace slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_workspace_boards_slug ON workspace_boards(workspace_slug);

-- Enable Row Level Security
ALTER TABLE workspace_boards ENABLE ROW LEVEL SECURITY;

-- Create policies (permitting all operations for simplicity in this sandbox, can be restricted to authenticated users)
CREATE POLICY "Public read access to boards" ON workspace_boards
  FOR SELECT USING (true);

CREATE POLICY "Public write access to boards" ON workspace_boards
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update access to boards" ON workspace_boards
  FOR UPDATE USING (true) WITH CHECK (true);
