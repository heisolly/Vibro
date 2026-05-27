CREATE TABLE IF NOT EXISTS workspace_states (
  workspace_slug TEXT NOT NULL,
  board_type TEXT NOT NULL CHECK (board_type IN ('architecture', 'design', 'inspiration', 'progress', 'canvas')),
  state_data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (workspace_slug, board_type)
);

ALTER TABLE workspace_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read workspace states" ON workspace_states
  FOR SELECT USING (true);

CREATE POLICY "Insert workspace states" ON workspace_states
  FOR INSERT WITH CHECK (auth.uid() = updated_by OR updated_by IS NULL);

CREATE POLICY "Update workspace states" ON workspace_states
  FOR UPDATE USING (auth.uid() = updated_by OR updated_by IS NULL);

ALTER PUBLICATION supabase_realtime ADD TABLE workspace_states;
