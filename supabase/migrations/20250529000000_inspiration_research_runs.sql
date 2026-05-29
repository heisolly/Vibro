CREATE TABLE IF NOT EXISTS inspiration_research_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_slug TEXT NOT NULL,
  prompt TEXT NOT NULL,
  active_tab TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('fresh', 'expand')),
  provider TEXT NOT NULL,
  query TEXT NOT NULL,
  search_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  analyses JSONB NOT NULL DEFAULT '[]'::jsonb,
  architecture JSONB,
  warning TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inspiration_research_runs_workspace
  ON inspiration_research_runs(user_id, workspace_slug, created_at DESC);

ALTER TABLE inspiration_research_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own inspiration research runs" ON inspiration_research_runs
  FOR ALL USING (auth.uid() = user_id);
