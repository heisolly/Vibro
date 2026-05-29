CREATE TABLE IF NOT EXISTS workspace_boards (
  workspace_slug TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  canvas_state JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE workspace_boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own workspace boards" ON workspace_boards
  FOR ALL USING (auth.uid() = user_id);
