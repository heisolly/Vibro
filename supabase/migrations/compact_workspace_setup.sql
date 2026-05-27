-- Compact workspace setup — idempotent, safe to re-run.

-- Drop legacy workspace_boards table (replaced by workspace_states)
DROP TABLE IF EXISTS workspace_boards CASCADE;

-- Table: workspace_invites
CREATE TABLE IF NOT EXISTS workspace_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_slug TEXT NOT NULL,
  invited_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_github_login TEXT NOT NULL,
  invited_github_avatar_url TEXT,
  invited_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_workspace_invites_slug ON workspace_invites(workspace_slug);
CREATE INDEX IF NOT EXISTS idx_workspace_invites_github_login ON workspace_invites(invited_github_login);
ALTER TABLE workspace_invites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage invites they sent" ON workspace_invites;
CREATE POLICY "Users manage invites they sent" ON workspace_invites
  FOR ALL USING (auth.uid() = invited_by_user_id);
DROP POLICY IF EXISTS "Users view invites for their GitHub login" ON workspace_invites;
CREATE POLICY "Users view invites for their GitHub login" ON workspace_invites
  FOR SELECT USING (invited_github_login IN (
    SELECT github_username FROM github_connections WHERE user_id = auth.uid()
  ));

-- Table: workspace_states (per-board-type state, replaces workspace_boards)
CREATE TABLE IF NOT EXISTS workspace_states (
  workspace_slug TEXT NOT NULL,
  board_type TEXT NOT NULL CHECK (board_type IN ('architecture', 'design', 'inspiration', 'progress', 'canvas')),
  state_data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID,
  PRIMARY KEY (workspace_slug, board_type)
);
ALTER TABLE workspace_states DISABLE ROW LEVEL SECURITY;

-- Add to Realtime publication (safe to re-run)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
  -- Remove and re-add table to ensure it's in the publication
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE workspace_states;
  EXCEPTION WHEN OTHERS THEN
    -- Table might not be in publication yet
  END;
  ALTER PUBLICATION supabase_realtime ADD TABLE workspace_states;
END $$;
