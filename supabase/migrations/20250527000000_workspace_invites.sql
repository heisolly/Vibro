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

CREATE POLICY "Users manage invites they sent" ON workspace_invites
  FOR ALL USING (auth.uid() = invited_by_user_id);

CREATE POLICY "Users view invites for their GitHub login" ON workspace_invites
  FOR SELECT USING (invited_github_login IN (
    SELECT github_username FROM github_connections WHERE user_id = auth.uid()
  ));
